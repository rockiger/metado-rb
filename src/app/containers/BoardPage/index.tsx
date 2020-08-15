/**
 *
 * BoardPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import {
  useToolbarState,
  Toolbar,
  ToolbarItem,
  ToolbarSeparator,
} from 'reakit/Toolbar';
import { Button } from 'reakit/Button';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectBoardPage } from './selectors';
import { boardPageSaga } from './saga';
import styled from 'styled-components';

interface Props {}

export function BoardPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: boardPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const boardPage = useSelector(selectBoardPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();
  const toolbar = useToolbarState({ loop: true });
  return (
    <BoardPageContainer>
      <Helmet>
        <title>BoardPage</title>
        <meta name="description" content="Description of BoardPage" />
      </Helmet>
      <Navbar {...toolbar} aria-label="Board Navbar">
        <ToolbarItem {...toolbar} as={Button}>
          Item 1
        </ToolbarItem>
        <ToolbarSeparator {...toolbar} />
        <ToolbarItem {...toolbar} as={Button}>
          Item 2
        </ToolbarItem>
        <ToolbarSeparator {...toolbar} />
        <ToolbarItem {...toolbar} as={Button}>
          Item 3
        </ToolbarItem>
      </Navbar>
      <Board>BoardPage</Board>
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

const Board = styled.div`
  padding: 2rem 4rem;
`;
