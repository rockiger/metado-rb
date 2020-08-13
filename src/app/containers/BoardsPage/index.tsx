/**
 *
 * BoardsPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectBoardsPage } from './selectors';
import { boardsPageSaga } from './saga';

interface Props {}

export function BoardsPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: boardsPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const boardsPage = useSelector(selectBoardsPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  return (
    <>
      <Helmet>
        <title>BoardsPage</title>
        <meta name="description" content="Description of BoardsPage" />
      </Helmet>
      <div>BoardsPage</div>
    </>
  );
}
