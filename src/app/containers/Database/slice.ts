import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the Database container
export const initialState = {};

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    syncUser(state, action: PayloadAction<any>) {
      console.log(action);
    },
    syncUserError(state, action: PayloadAction<any>) {
      console.log(action);
    },
  },
});

export const { actions, reducer, name: sliceKey } = databaseSlice;
