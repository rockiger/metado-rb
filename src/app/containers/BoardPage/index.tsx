/**
 *
 * BoardPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { Link, Redirect, useParams } from 'react-router-dom';
import {
  useToolbarState,
  Toolbar,
  ToolbarItem,
  ToolbarSeparator,
} from 'reakit/Toolbar';
import { Button } from 'reakit/Button';
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
  const toolbar = useToolbarState({ loop: true });

  console.log({ ownerId, boardId, uid, currentBoard: activeBoard, board });

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
        {board.columns.map(col => (
          <Column key={col.title}>
            <h2>{col.title}</h2>
            {!_.isEmpty(tasks) &&
              col.taskIds.map(id => {
                const task = tasks[id];
                return <Card key={id}>{task.title}</Card>;
              })}
          </Column>
        ))}
      </Board>
    </BoardPageContainer>
  );
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

const NavbarSeparator = styled(ToolbarSeparator)`
  margin: 0 0 0 0.5rem;
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
  width: 25%;
`;

const Card = styled.div`
  border: 1px solid grey;
  border-radius: 4px;
`;
