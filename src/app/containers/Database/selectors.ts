import { createSelector } from '@reduxjs/toolkit';
import { RootState } from 'types';

import { initialState } from './slice';

const selectDomain = (state: RootState) => state.database || initialState;

export const selectAddingProject = createSelector(
  [selectDomain],
  state => state.addingProjectStatus,
);

export const selectActiveBoard = createSelector(
  [selectDomain],
  state => state.user.activeBoard,
);

export const selectBoard = createSelector([selectDomain], state => ({
  board: state.board,
  boardStatus: state.boardStatus,
}));

export const selectIsAuthenticated = createSelector(
  [selectDomain],
  state => state.authUser.uid,
);

export const selectProjects = createSelector(
  [selectDomain],
  state => state.projects,
);

export const selectTasks = createSelector([selectDomain], state => state.tasks);

export const selectUid = createSelector(
  [selectDomain],
  state => state.authUser.uid,
);

export const selectUser = createSelector([selectDomain], state => state.user);

export const selectError = createSelector([selectDomain], state => state.error);
