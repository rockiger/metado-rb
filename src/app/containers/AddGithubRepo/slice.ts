import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the AddGithubRepo container
export const initialState: ContainerState = {
  repos: [],
  status: 'idle',
};

const addGithubRepoSlice = createSlice({
  name: 'addGithubRepo',
  initialState,
  reducers: {
    fetchGithubRepos(state, action: PayloadAction<{ githubToken: string }>) {
      state.status = 'fetching';
    },
    fetchGithubReposError(state, action: PayloadAction<{ error: Error }>) {
      state.status = 'error';
    },
    fetchGithubReposSuccess(state, action: PayloadAction<{ repos: any[] }>) {
      state.status = 'success';
      state.repos = action.payload.repos;
    },
  },
});

export const { actions, reducer, name: sliceKey } = addGithubRepoSlice;
