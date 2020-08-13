import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.boardsPage || initialState;

export const selectBoardsPage = createSelector(
  [selectDomain],
  boardsPageState => boardsPageState,
);
