import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import {
  AuthUser,
  Board,
  ContainerState,
  Task,
  TaskMap,
  ProjectMap,
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
    addTask(
      state,
      action: PayloadAction<{
        board: Board;
        owner: string;
        projects: ProjectMap;
        taskData: { description: string; projectId: string; title: string };
      }>,
    ) {},
    getBoard(state, action: PayloadAction<{ uid: string; boardId: string }>) {},
    setBoard(state, action: PayloadAction<{ board: Board }>) {
      state.board = action.payload.board;
      state.boardStatus = 'success';
    },
    updateBoard(state, action: PayloadAction<{ board: Board; uid: string }>) {
      state.board = action.payload.board;
    },
    getProjects(state, action: PayloadAction<{ uid: string }>) {
      console.log('getProjects');
    },
    setProjects(state, action: PayloadAction<{ projects: ProjectMap }>) {
      state.projects = action.payload.projects;
    },
    getTasks(
      state,
      action: PayloadAction<{ uid: string; projectIds: string[] }>,
    ) {},
    setTasks(state, action: PayloadAction<{ tasks: TaskMap }>) {
      state.tasks = action.payload.tasks;
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
      action: PayloadAction<{ email: string; uid: string; username: string }>,
    ) {},
    openBoardChannel(
      state,
      action: PayloadAction<{ uid: string; boardId: string }>,
    ) {
      state.boardStatus = 'fetching';
    },
    closeBoardChannel(state) {
      state.boardStatus = 'init';
    },
    openTasksChannel(
      state,
      action: PayloadAction<{ uid: string; projectIds: string[] }>,
    ) {},
    closeTasksChannel() {},
    resetAddProject(state) {
      state.addingProjectStatus = 'init';
    },
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
    updateActiveBoard(
      state,
      action: PayloadAction<{ boardId: string; uid: string }>,
    ) {
      state.authUser.profile.activeBoard = action.payload.boardId;
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
