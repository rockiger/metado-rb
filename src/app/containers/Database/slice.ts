import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { AuthUser, Board, ContainerState, Task, TaskMap } from './types';

// The initial state of the Database container
export const initialState: ContainerState = {
  authUser: getLocalAuthUser(),
  board: {
    columns: [],
    id: '',
    isDeleted: false,
    projects: [],
    showBacklog: true,
    title: '',
  },
  tasks: {},
};

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    getBoard(state, action: PayloadAction<{ uid: string; boardId: string }>) {},
    setBoard(state, action: PayloadAction<{ board: Board }>) {
      state.board = action.payload.board;
    },
    updateBoard(state, action: PayloadAction<{ board: Board; uid: string }>) {
      state.board = action.payload.board;
      //! write to database.
    },
    getTasks(
      state,
      action: PayloadAction<{ uid: string; projectIds: string[] }>,
    ) {},
    setTasks(state, action: PayloadAction<{ tasks: TaskMap }>) {
      state.tasks = action.payload.tasks;
    },
    updateTask(state, action: PayloadAction<{ task: Task }>) {
      const { task } = action.payload;
      state.tasks[task.id] = task;
    },
    openBoardChannel(
      state,
      action: PayloadAction<{ uid: string; boardId: string }>,
    ) {},
    closeBoardChannel() {},
    openTasksChannel(
      state,
      action: PayloadAction<{ uid: string; projectIds: string[] }>,
    ) {},
    closeTasksChannel() {},
    syncUser(state, action: PayloadAction<{ [key: string]: any }>) {
      setLocalAuthUser(action.payload);
      state.authUser = action.payload;
    },
    syncUserError(state, action: PayloadAction<any>) {
      setLocalAuthUser(null);
      console.log(action);
    },
    syncBoardFromProviders(
      state,
      action: PayloadAction<{ board: Board; tasks: TaskMap; uid: string }>,
    ) {
      console.log('syncBoardFromProviders');
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
