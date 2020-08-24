/**
 *
 * BoardPage
 *
 */

import React, { useEffect, useState } from 'react';
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from 'react-beautiful-dnd';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect, useParams } from 'react-router-dom';
import { Button } from 'reakit/Button';
import {
  useToolbarState,
  Toolbar,
  ToolbarItem,
  ToolbarSeparator,
} from 'reakit/Toolbar';
import produce from 'immer';
import * as _ from 'lodash';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

import { Horizontal } from 'app/components/Horizontal';
import {
  selectActiveBoard,
  selectBoard,
  selectTasks,
  selectUid,
} from 'app/containers/Database/selectors';
import { actions as databaseActions } from 'app/containers/Database/slice';
import { Board as BoardType, TaskMap } from 'app/containers/Database/types';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { boardPageSaga } from './saga';

interface Props {}

export function BoardPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: boardPageSaga });
  const dispatch = useDispatch();
  const { ownerId, boardId } = useParams();
  const activeBoard = useSelector(selectActiveBoard);
  const board = useSelector(selectBoard);
  const tasks = useSelector(selectTasks);
  const uid = useSelector(selectUid);
  const [isBoardUpdated, setIsBoardUpdated] = useState(false);
  const toolbar = useToolbarState({ loop: true });

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

  if (uid !== ownerId || ownerId === undefined || boardId === undefined) {
    return <Redirect to={`/b/${uid}/${activeBoard}`} />;
  }

  return (
    <BoardPageContainer>
      <Helmet>
        <title>BoardPage</title>
        <meta name="description" content="Description of BoardPage" />
      </Helmet>
      <Navbar {...toolbar} aria-label="Board Navbar" role="navigation">
        <ToolbarItem {...toolbar} as={Button}>
          Item 1
        </ToolbarItem>
        <ToolbarSeparator {...toolbar} />
        <ToolbarItem {...toolbar} as={Link} to="/">
          Home
        </ToolbarItem>
        <ToolbarSeparator {...toolbar} />
        <ToolbarItem {...toolbar} as={Button}>
          Item 3
        </ToolbarItem>
      </Navbar>
      <Board>
        <DragDropContext
          onDragEnd={result => onDragEnd(result, board, ownerId, tasks)}
        >
          {board.columns.map((col, index) => (
            <Column key={col.title}>
              <h2>{col.title}</h2>
              <Droppable droppableId={`${index}`}>
                {provided => (
                  <Cards
                    className="list-content"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      {!_.isEmpty(tasks) &&
                        col.taskIds.map((id, index) => {
                          const task = tasks[id];
                          return (
                            <Draggable draggableId={id} key={id} index={index}>
                              {provided => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => 'onClick(task)'}
                                >
                                  <Card key={id}>{task.title}</Card>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  </Cards>
                )}
              </Droppable>
            </Column>
          ))}
        </DragDropContext>
      </Board>
    </BoardPageContainer>
  );

  function onDragEnd(
    result: DropResult,
    board: BoardType,
    ownerId: string,
    tasks: TaskMap,
  ) {
    console.log({ result });
    const dragResult = onDragEndResult(result, board, ownerId, tasks);
    dragResult.forEach(el => dispatch(el));
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
    databaseActions.updateTask({ oldTask, task: newTask }),
  ];
}

const BoardPageContainer = styled.div`
  background-color: ${p => p.theme.palette.background.default};
  min-height: 100vh;
`;

const Navbar = styled(Toolbar)`
  background-color: white;
  box-shadow: ${p => p.theme.shadows[3]};
  display: flex;
  height: 4rem;
  padding: 1rem 2rem;
`;

const IconButton = styled(ToolbarItem)``;

const Board = styled(Horizontal)`
  align-items: flex-start;
  gap: 1.5rem;
  justify-content: space-evenly;
  overflow: auto;
  padding: 2rem;
  width: 100% ${media.greaterThan('medium')`
    padding: 2rem 4rem;
  `};
`;

const Column = styled.div`
  background-color: white;
  min-height: 10rem;
  min-width: 16rem;
  padding: 1rem;
  width: 25%;
`;

const Cards = styled.div`
  min-height: 10rem;
`;

const Card = styled.div`
  background-color: white;
  border: 1px solid grey;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem;
  &:last-child {
    margin-bottom: 1rem;
  }
`;