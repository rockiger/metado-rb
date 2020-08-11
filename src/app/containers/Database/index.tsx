/**
 *
 * Database
 *
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectDatabase } from './selectors';
import { databaseSaga } from './saga';

interface Props {}

export function Database(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: databaseSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const database = useSelector(selectDatabase);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  return null;
}
