import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { AuthUser, ContainerState } from './types';

// The initial state of the Database container
export const initialState: ContainerState = {
  authUser: getLocalAuthUser(),
};

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    syncUser(state, action: PayloadAction<{ [key: string]: any }>) {
      setLocalAuthUser(action.payload);
      state.authUser = action.payload;
    },
    syncUserError(state, action: PayloadAction<any>) {
      setLocalAuthUser(null);
      console.log(action);
    },
  },
});

export const { actions, reducer, name: sliceKey } = databaseSlice;

function getLocalAuthUser() {
  const authStorageJson = localStorage.getItem('authUser');
  const authStorage = authStorageJson ? JSON.parse(authStorageJson) : {};
  if (isAuthUser(authStorage)) return authStorage;
  return {};
}

function isAuthUser(obj: any): obj is AuthUser {
  return typeof obj === 'object';
}

function setLocalAuthUser(authUser) {
  localStorage.setItem('authUser', JSON.stringify(authUser));
}
