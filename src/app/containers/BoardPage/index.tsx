/**
 *
 * BoardPage
 *
 */

import React, { useEffect, useRef, useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Button } from 'reakit/Button';
import { useDialogState } from 'reakit/Dialog';
import produce from 'immer';
import * as _ from 'lodash';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

import { Navbar } from 'app/components/Navbar';
import {
  Horizontal,
  PageHeader,
  PageTitle,
  PrivatePage,
  Spacer,
} from 'app/components/UiComponents';

import {
  selectActiveBoard,
  selectBoard,
  selectTasks,
  selectUid,
  selectProjects,
} from 'app/containers/Database/selectors';
import { actions as databaseActions } from 'app/containers/Database/slice';
import {
  Board as BoardType,
  ProjectMap,
  Task,
  TaskMap,
} from 'app/containers/Database/types';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { BoardColumn } from './BoardColumn';
import { reducer, sliceKey } from './slice';
import { boardPageSaga } from './saga';
import { AddCard } from './AddTask';
import { EditTask } from './EditTask';

interface Props {}

export function BoardPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: boardPageSaga });
  const dispatch = useDispatch();
  const { ownerId, boardId } = useParams();
  const activeBoard = useSelector(selectActiveBoard);
  const board = useSelector(selectBoard);
  const projects = useSelector(selectProjects);
  const tasks = useSelector(selectTasks);
  const uid = useSelector(selectUid);
  const [isBoardUpdated, setIsBoardUpdated] = useState(false);
  const editDialogState = useDialogState();
  const [editTaskState, setEditTaskState] = useState<Task | null>(null);
  const editDialogFinalFocusRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (boardId && board.id !== boardId && ownerId && ownerId === uid) {
      dispatch(databaseActions.openBoardChannel({ uid: ownerId, boardId }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, boardId, ownerId, uid]);

  useEffect(() => {
    if (board.id && _.isEmpty(tasks)) {
      dispatch(
        databaseActions.openTasksChannel({
          uid: ownerId,
          projectIds: board.projects,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, ownerId, tasks]);

  useEffect(() => {
    return () => {
      dispatch(databaseActions.closeBoardChannel());
      dispatch(databaseActions.closeTasksChannel());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isBoardUpdated && board.id && !_.isEmpty(tasks) && uid) {
      dispatch(databaseActions.syncBoardFromProviders({ board, tasks, uid }));
      setIsBoardUpdated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board, isBoardUpdated, tasks, uid]);

  useEffect(() => {
    if (uid) {
      dispatch(databaseActions.getProjects({ uid }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  if (uid !== ownerId || ownerId === undefined || boardId === undefined) {
    return <Redirect to={`/b/${uid}/${activeBoard}`} />;
  }

  return (
    <PrivatePage>
      <Helmet>
        <title>BoardPage</title>
        <meta name="description" content="Description of BoardPage" />
      </Helmet>
      <Navbar />
      <PageHeader>
        <PageTitle>{board.title}</PageTitle>
        <Spacer />
        {board.projects.length < 10 && (
          <Button as={Link} to={`/projects/add/github`}>
            Add GitHub Project
          </Button>
        )}
        <AddCard
          addTaskOnSubmit={_.partial(addTaskToBoard, board, ownerId, projects)}
          projects={reduceProjects(board.projects, projects)}
        />
      </PageHeader>
      <BoardContent ref={editDialogFinalFocusRef}>
        <DragDropContext
          onDragEnd={result => onDragEnd(result, board, ownerId, tasks)}
        >
          {board.columns.map((col, index) => (
            <BoardColumn
              col={col}
              index={index}
              key={index}
              tasks={tasks}
              handleClickTask={handleClickTask}
            />
          ))}
        </DragDropContext>
      </BoardContent>
      <EditTask
        dialogState={editDialogState}
        finalFocusRef={editDialogFinalFocusRef}
        handleEditTask={handleEditTask}
        task={editTaskState}
      />
    </PrivatePage>
  );

  function handleClickTask(task: Task) {
    console.log('handelClickTask', { task });
    setEditTaskState(task);
    editDialogState.show();
  }

  function onDragEnd(
    result: DropResult,
    board: BoardType,
    ownerId: string,
    tasks: TaskMap,
  ) {
    console.log({ result });
    const dragResult = onDragEndResult(result, board, ownerId, projects, tasks);
    dragResult.forEach(el => dispatch(el));
  }

  function addTaskToBoard(board, owner, projects, taskData) {
    dispatch(databaseActions.addTask({ board, owner, projects, taskData }));
  }

  function handleEditTask(oldTask, task) {
    console.log('handleEditTask', { task });
    dispatch(databaseActions.updateTask({ oldTask, task, projects }));
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
) {
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
  const title = finishColumn.title;

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

    return [databaseActions.updateBoard({ board: newBoard, uid: ownerId })];
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
    draftTask.status = title;
  });

  return [
    databaseActions.updateBoard({ board: newBoard, uid: ownerId }),
    databaseActions.updateTask({ oldTask, task: newTask, projects }),
  ];
}
export const BoardContent = styled(Horizontal)<{ ref: any }>`
  align-items: flex-start;
  gap: 1.5rem;
  justify-content: space-evenly;
  overflow: auto;
  padding: 2rem;
  width: 100% ${media.greaterThan('medium')`
    padding: 2rem 4rem;
  `};
`;

function reduceProjects(
  projectIds: string[],
  projects: ProjectMap,
): ProjectMap {
  return Object.keys(projects)
    .filter(key => projectIds.includes(key))
    .reduce((obj, key) => {
      obj[key] = projects[key];
      return obj;
    }, {});
}
