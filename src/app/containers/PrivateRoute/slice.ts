import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the PrivateRoute container
export const initialState: ContainerState = {};

const privateRouteSlice = createSlice({
  name: 'privateRoute',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
});

export const { actions, reducer, name: sliceKey } = privateRouteSlice;
