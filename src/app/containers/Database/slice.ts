import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import {
  AuthUser,
  Board,
  ContainerState,
  ProjectMap,
  Task,
  TaskMap,
  User,
} from './types';

const initialBoard: Board = {
  columns: [],
  id: '',
  isDeleted: false,
  projects: [],
  showBacklog: true,
  title: '',
};
// The initial state of the Database container
export const initialState: ContainerState = {
  addingProjectStatus: 'init',
  authUser: getLocalAuthUser(),
  board: initialBoard,
  boardStatus: 'init',
  projects: {},
  tasks: {},
  user: { activeBoard: '' },
  error: null,
};
const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    addGithubProject(
      state,
      action: PayloadAction<{
        activeBoard: string;
        repo: { [x: string]: any };
      }>,
    ) {
      state.addingProjectStatus = 'fetching';
    },
    addGithubProjectError(state, action: PayloadAction<{ error: any }>) {
      state.addingProjectStatus = 'error';
      state.error = action.payload.error;
    },
    addGithubProjectSuccess(state) {
      state.addingProjectStatus = 'success';
    },
    addGoogleTasksProject(
      state,
      action: PayloadAction<{
        activeBoard: string;
        taskList: { [x: string]: any };
      }>,
    ) {
      state.addingProjectStatus = 'fetching';
    },
    addGoogleTasksProjectError(state, action: PayloadAction<{ error: any }>) {
      state.addingProjectStatus = 'error';
      state.error = action.payload.error;
    },
    addGoogleTasksProjectSuccess(state) {
      state.addingProjectStatus = 'success';
    },
    addTask(
      state,
      action: PayloadAction<{
        board: Board;
        owner: string;
        projects: ProjectMap;
        taskData: { description: string; projectId: string; title: string };
      }>,
    ) {},
    closeBoardChannel(state) {
      state.boardStatus = 'init';
    },
    getBoard(state, action: PayloadAction<{ uid: string; boardId: string }>) {},
    getProjects(state, action: PayloadAction<{ uid: string }>) {
      console.log('getProjects');
    },
    getTasks(
      state,
      action: PayloadAction<{ uid: string; projectIds: string[] }>,
    ) {},
    logout(state) {},
    logoutSuccess(state) {
      state.authUser = emptyAuthUser();
      state.user = emptyUser();
    },
    setBoard(state, action: PayloadAction<{ board: Board }>) {
      state.board = action.payload.board;
      state.boardStatus = 'success';
    },
    setProjects(state, action: PayloadAction<{ projects: ProjectMap }>) {
      state.projects = action.payload.projects;
    },
    setTasks(state, action: PayloadAction<{ tasks: TaskMap }>) {
      state.tasks = action.payload.tasks;
    },
    setUser(state, action: PayloadAction<{ user: User }>) {
      state.user = action.payload.user;
    },
    updateBoard(state, action: PayloadAction<{ board: Board; uid: string }>) {
      state.board = action.payload.board;
    },
    updateTask(
      state,
      action: PayloadAction<{
        oldTask: Task;
        projects: ProjectMap;
        task: Task;
      }>,
    ) {
      const { task } = action.payload;
      state.tasks[task.id] = task;
    },
    updateUserCredentials(
      state,
      action: PayloadAction<{
        email: string;
        uid: string;
        displayName: string;
      }>,
    ) {},
    openBoardChannel(
      state,
      action: PayloadAction<{ uid: string; boardId: string }>,
    ) {
      state.boardStatus = 'fetching';
    },
    openTasksChannel(
      state,
      action: PayloadAction<{ uid: string; projectIds: string[] }>,
    ) {},
    closeTasksChannel() {},
    resetAddProject(state) {
      state.addingProjectStatus = 'init';
    },
    syncAuthUser(state, action: PayloadAction<AuthUser>) {
      setLocalAuthUser(action.payload);
      state.authUser = action.payload;
    },
    syncAuthUserError(state, action: PayloadAction<any>) {
      setLocalAuthUser(emptyAuthUser());
      console.log(action);
    },
    syncBoardFromProviders(
      state,
      action: PayloadAction<{ board: Board; tasks: TaskMap; uid: string }>,
    ) {
      console.log('syncBoardFromProviders');
    },
    updateActiveBoard(
      state,
      action: PayloadAction<{ boardId: string; uid: string }>,
    ) {
      state.user.activeBoard = action.payload.boardId;
    },
  },
});

export const { actions, reducer, name: sliceKey } = databaseSlice;

function emptyAuthUser(): AuthUser {
  return {
    email: '',
    displayName: '',
    photoURL: '',
    uid: '',
  };
}

function emptyUser(): User {
  return {
    activeBoard: '',
  };
}

function getLocalAuthUser(): AuthUser {
  const authStorageJson = localStorage.getItem('authUser');
  const authStorage = authStorageJson ? JSON.parse(authStorageJson) : {};
  if (isAuthUser(authStorage)) return authStorage;
  return emptyAuthUser();
}

function isAuthUser(obj: any): obj is AuthUser {
  return typeof obj === 'object';
}

function setLocalAuthUser(authUser) {
  localStorage.setItem('authUser', JSON.stringify(authUser));
}
