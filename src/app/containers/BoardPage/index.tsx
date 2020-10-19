/**
 *
 * BoardPage
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Helmet } from 'react-helmet-async';
import { Link, Redirect, useParams } from 'react-router-dom';
import { useDialogState } from 'reakit/Dialog';
import produce from 'immer';
import * as _ from 'lodash';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

import { Navbar } from 'app/components/PrivateNavbar';
import {
  Button,
  ButtonClear,
  Card,
  Column,
  PageHeader,
  PageTitle,
  PrivatePage,
  Row,
  Spacer,
} from 'app/components/UiComponents';

import {
  Board as BoardType,
  ProjectMap,
  Task,
  TaskMap,
  TaskState,
} from 'app/containers/Database/types';

import { BoardColumn } from './BoardColumn';
import { AddCard } from './AddTask';
import { EditTask } from './EditTask';
import { db, useAuth } from '../Database/firebase';
import { syncBoardFromProviders } from './helpers';
import {
  closeIssue,
  openIssue,
  updateIssue,
} from '../Database/connectors/github';
import * as googletasksConnector from '../Database/connectors/googletasks';

export function BoardPage() {
  const { ownerId, boardId } = useParams<{
    ownerId: string;
    boardId: string;
  }>();

  console.log('Boardpage');
  const [status, setStatus] = useState<
    'init' | 'profileLoaded' | 'boardConnected' | 'tasksConnected' | 'synced'
  >('init');
  const editDialogState = useDialogState();
  const [editTaskState, setEditTaskState] = useState<Task | null>(null);
  const editDialogFinalFocusRef = useRef<HTMLElement>(null);

  const { user, profile } = useAuth();
  const uid = user?.uid;
  const [board, setBoard] = useState<any>({});
  const [listeners, setListeners] = useState<(() => void)[]>([]);
  const [projects, setProjects] = useState<any>({});
  const activeBoard = profile?.activeBoard;
  const [tasks, setTasks] = useState<any>({});

  // console.log({ activeBoard, board, status, tasks, uid: uid, user });

  useEffect(() => {
    const getData = async () => {
      if (user && boardId && ownerId === user.uid && status === 'init') {
        // connect board
        const boardRef = db
          .collection('users')
          .doc(ownerId)
          .collection('boards')
          .doc(boardId);
        const boardSnapshot = await boardRef.get();
        const boardData = boardSnapshot.data();
        const boardListener = boardRef.onSnapshot(doc => setBoard(doc.data()));
        setListeners([...listeners, boardListener]);
        setStatus('boardConnected');

        if (boardData?.projects.length) {
          // get projects
          const projectsRef = db
            .collection('projects')
            .where('id', 'in', boardData.projects);
          const projectsSnapshot = await projectsRef.get();
          let projectsData = {};
          projectsSnapshot.forEach(doc => (projectsData[doc.id] = doc.data()));
          setProjects(projectsData);

          // connect tasks
          const tasksRef = db
            .collection('tasks')
            .where('project', 'in', boardData?.projects)
            .where('user', '==', ownerId);
          const tasksSnapshot = await tasksRef.get();
          let tasksData = {};
          tasksSnapshot.forEach(doc => (tasksData[doc.id] = doc.data()));
          const taskListener = tasksRef.onSnapshot(snapShot => {
            let tasksData = {};
            snapShot.forEach(doc => (tasksData[doc.id] = doc.data()));
            setTasks(tasksData);
          });
          setListeners([...listeners, taskListener]);
          setStatus('tasksConnected');

          // sync board with connectors
          await syncBoardFromProviders(boardData, setBoard, tasksData, ownerId);
          // colocato projects
        }
      }
    };
    getData();
  }, [boardId, ownerId, status, user, listeners]);

  useEffect(() => {
    return () => {
      console.log('Remove listeners');
      listeners.forEach(unsubscribe => unsubscribe());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    (uid !== ownerId ||
      ownerId === undefined ||
      boardId === undefined ||
      (status === 'boardConnected' && board === undefined)) &&
    activeBoard
  ) {
    return <Redirect to={`/b/${uid}/${activeBoard}`} />;
  }

  return (
    <PrivatePage>
      <Helmet>
        <title>Board</title>
        <meta name="description" content="Description of BoardPage" />
      </Helmet>
      <Navbar />

      <PageHeader>
        <PageTitle>{board?.title}</PageTitle>
        <Spacer />
        {status === 'tasksConnected' && !_.isEmpty(board?.projects) && (
          <>
            {board?.projects?.length < 10 && (
              <>
                <ButtonClear as={Link} to={`/projects/add/googletasks`}>
                  Add Google Tasks List
                </ButtonClear>
                <ButtonClear as={Link} to={`/projects/add/github`}>
                  Add GitHub Repo
                </ButtonClear>
              </>
            )}
            {board && (
              <AddCard board={board} ownerId={ownerId} projects={projects} />
            )}
          </>
        )}
      </PageHeader>

      <BoardContent ref={editDialogFinalFocusRef}>
        {status === 'tasksConnected' && !_.isEmpty(board?.projects) && (
          <>
            <DragDropContext
              onDragEnd={result => onDragEnd(result, board, ownerId, tasks)}
            >
              {board.columns.map((col, index) => (
                <BoardColumn
                  col={col}
                  index={index}
                  key={index}
                  projects={projects}
                  tasks={tasks}
                  handleClickTask={handleClickTask}
                />
              ))}
            </DragDropContext>
            <EditTask
              dialogState={editDialogState}
              finalFocusRef={editDialogFinalFocusRef}
              handleCancelEdit={() => setEditTaskState(null)}
              task={editTaskState}
            />
          </>
        )}
        {!activeBoard && !boardId && !board?.id && (
          <div>Preparing your board...</div>
        )}
        {((status === 'tasksConnected' && !board?.id && boardId) ||
          (ownerId && ownerId !== uid)) && (
          <>
            <div>Couldn't find board</div>
            <p>Go to last used board...</p>
          </>
        )}
        {board?.id && _.isEmpty(board.projects) && (
          <Card>
            <Column align="center">
              <h5>
                It seems your board doesn't have any projects attached. Go and
                add one.
              </h5>
              <p>
                <img
                  src="/images/empty.svg"
                  alt="empty box"
                  style={{ width: '40rem' }}
                />
              </p>

              <Button as={Link} to={`/projects/add/googletasks`}>
                Add Google Tasks List
              </Button>
              <p></p>
              <Button as={Link} to={`/projects/add/github`}>
                Add GitHub Project
              </Button>
            </Column>
          </Card>
        )}
      </BoardContent>
    </PrivatePage>
  );

  function handleClickTask(task: Task) {
    setEditTaskState(task);
    editDialogState.show();
  }

  async function onDragEnd(
    result: DropResult,
    board: BoardType,
    ownerId: string,
    tasks: TaskMap,
  ) {
    const dragResult = onDragEndResult(result, board, ownerId, projects, tasks);
    dragResult.forEach(async el => {
      console.log(el[0], el[1]);
      if (el[0] === 'updateBoard') {
        const { board, uid } = el[1];
        setBoard(board);

        const boardRef = db
          .collection('users')
          .doc(uid)
          .collection('boards')
          .doc(board.id);
        try {
          await boardRef.set(board);
        } catch (error) {
          console.error(error);
        }
      }
      if (el[0] === 'updateTask') {
        const { oldTask, projects, task } = el[1];
        const profile = { githubToken: '!!!' }; //!
        const project = projects[oldTask.project];
        setTasks({ ...tasks, [task.id]: task });

        const taskRef = db.collection('tasks').doc(task.id);
        try {
          await taskRef.set(task);
          if (task.id.startsWith('github') && profile.githubToken) {
            if (
              oldTask.status === TaskState.Done &&
              task.status !== TaskState.Done
            ) {
              openIssue(profile.githubToken, task, project);
            }
            if (
              oldTask.status !== TaskState.Done &&
              task.status === TaskState.Done
            ) {
              closeIssue(profile.githubToken, task, project);
            }
            if (
              oldTask.title !== task.title ||
              oldTask.description !== task.description
            ) {
              updateIssue(profile.githubToken, task, project);
            }
          }
          if (task.id.startsWith('googletasks')) {
            googletasksConnector.updateTask(task, project);
          }
        } catch (error) {
          console.error(error);
        }
      }
    });
  }
}

/**
 * Produces an array with the actions to perform to change
 * the state accordingly to the users drag and drop actions .
 * @param result the dropResult from react-beautiful-dnd
 * @param board the current board
 * @param ownerId the owner of the board
 * @param tasks the current tasks
 * @returns the array with the actions
 */
export function onDragEndResult(
  result: DropResult,
  board: BoardType,
  ownerId: string,
  projects: ProjectMap,
  tasks: TaskMap,
): [string, { [key: string]: any }][] {
  const { destination, source, draggableId } = result;
  // nothing changed
  if (
    !destination ||
    (destination.droppableId === source.droppableId &&
      destination.index === source.index)
  ) {
    return [];
  }
  const startColumn = board.columns[source.droppableId];
  const finishColumn = board.columns[destination.droppableId];
  const newStatus = finishColumn.title;

  // same column
  if (startColumn.title === finishColumn.title) {
    const newTaskIds = produce(startColumn.taskIds, draftTaskIds => {
      draftTaskIds.splice(source.index, 1);
      draftTaskIds.splice(destination.index, 0, draggableId);
    });
    const newColumn = produce(startColumn, draftColumn => {
      draftColumn.taskIds = newTaskIds;
    });

    const newColumns = produce(board.columns, draftColumns => {
      draftColumns[source.droppableId] = newColumn;
    });

    const newBoard = produce(board, draftBoard => {
      draftBoard.columns = newColumns;
    });

    return [['updateBoard', { board: newBoard, uid: ownerId }]];
  }

  // moving from one column to another
  const startTaskIds = produce(startColumn.taskIds, draftTaskIds => {
    draftTaskIds.splice(source.index, 1);
  });
  const newStartColumn = produce(startColumn, draftColumn => {
    draftColumn.taskIds = startTaskIds;
  });

  const finishTaskIds = produce(finishColumn.taskIds, draftTaskIds => {
    draftTaskIds.splice(destination.index, 0, draggableId);
  });
  const newFinishColumn = produce(finishColumn, draftColumn => {
    draftColumn.taskIds = finishTaskIds;
  });

  const newColumns = produce(board.columns, draftColumns => {
    draftColumns[source.droppableId] = newStartColumn;
    draftColumns[destination.droppableId] = newFinishColumn;
  });

  const newBoard = produce(board, draftBoard => {
    draftBoard.columns = newColumns;
  });

  //change state of task
  const oldTask = tasks[draggableId];
  const newTask = produce(oldTask, draftTask => {
    draftTask.status = newStatus;
    draftTask.edited = new Date().toISOString();
    if (newStatus === 'Done') {
      draftTask.finished = new Date().toISOString();
    }
  });

  return [
    ['updateBoard', { board: newBoard, uid: ownerId }],
    ['updateTask', { oldTask, task: newTask, projects }],
  ];
}
export const BoardContent = styled(Row)<{ ref: any }>`
  align-items: flex-start;
  gap: 1.5rem;
  justify-content: space-evenly;
  overflow: auto;
  padding: 2rem;
  width: 100%;
  ${media.greaterThan('medium')`
    padding: 2rem 4rem;
  `};
`;
