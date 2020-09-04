import { createSelector } from '@reduxjs/toolkit';
import _ from 'lodash';
import { RootState } from 'types';

import { initialState } from './slice';

const selectDomain = (state: RootState) => state.database || initialState;

export const selectAddingProject = createSelector(
  [selectDomain],
  state => state.addingProject,
);

export const selectActiveBoard = createSelector(
  [selectDomain],
  state => state.authUser.profile.activeBoard,
);

export const selectBoard = createSelector([selectDomain], state => state.board);

export const selectIsAuthenticated = createSelector(
  [selectDomain],
  state => !_.isEmpty(state.authUser),
);

export const selectTasks = createSelector([selectDomain], state => state.tasks);

export const selectUid = createSelector(
  [selectDomain],
  state => state.authUser.uid,
);

export const selectUserProfile = createSelector(
  [selectDomain],
  state => state.authUser.profile,
);
