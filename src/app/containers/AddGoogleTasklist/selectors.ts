import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.addGoogleTasklist || initialState;

export const selectAddGoogleTasklist = createSelector(
  [selectDomain],
  addGoogleTasklistState => addGoogleTasklistState,
);
