import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the AddGoogleTasklist container
export const initialState: ContainerState = {};

const addGoogleTasklistSlice = createSlice({
  name: 'addGoogleTasklist',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
});

export const { actions, reducer, name: sliceKey } = addGoogleTasklistSlice;
