import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.addGithubRepo || initialState;

export const selectAddGithubRepo = createSelector(
  [selectDomain],
  addGithubRepoState => addGithubRepoState,
);
