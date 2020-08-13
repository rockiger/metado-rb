import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.privateRoute || initialState;

export const selectPrivateRoute = createSelector(
  [selectDomain],
  privateRouteState => privateRouteState,
);
