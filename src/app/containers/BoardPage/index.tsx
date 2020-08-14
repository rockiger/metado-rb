/**
 *
 * BoardPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectBoardPage } from './selectors';
import { boardPageSaga } from './saga';

interface Props {}

export function BoardPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: boardPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const boardPage = useSelector(selectBoardPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  return (
    <>
      <Helmet>
        <title>BoardPage</title>
        <meta name="description" content="Description of BoardPage" />
      </Helmet>
      <div>BoardPage</div>
    </>
  );
}
