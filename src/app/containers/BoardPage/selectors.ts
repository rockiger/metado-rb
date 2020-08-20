import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.boardPage || initialState;

export const selectBoardPage = createSelector(
  [selectDomain],
  boardPageState => boardPageState,
);
