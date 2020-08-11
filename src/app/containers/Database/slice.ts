import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the Database container
export const initialState = {
  authUser: {},
};

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    syncUser(state, action: PayloadAction<{ [key: string]: any }>) {
      state.authUser = action.payload;
    },
    syncUserError(state, action: PayloadAction<any>) {
      console.log(action);
    },
  },
});

export const { actions, reducer, name: sliceKey } = databaseSlice;
