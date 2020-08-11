import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RootState } from 'types';

import { initialState } from './slice';

const selectDomain = (state: RootState) => state.database || initialState;

export const selectDatabase = createSelector(
  [selectDomain],
  databaseState => databaseState,
);

export const selectIsAuthenticated = createSelector(
  [selectDomain],
  databaseState => !_.isEmpty(databaseState.authUser),
);
