import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the AddGithubRepo container
export const initialState: ContainerState = {};

const addGithubRepoSlice = createSlice({
  name: 'addGithubRepo',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
});

export const { actions, reducer, name: sliceKey } = addGithubRepoSlice;
