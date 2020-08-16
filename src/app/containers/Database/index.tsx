/**
 *
 * Database
 *
 */
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { databaseSaga } from './saga';

interface Props {}

export function Database(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: databaseSaga });
  return null;
}
