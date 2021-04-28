/* --- STATE --- */
export interface DatabaseState {
  addingProjectStatus: LoadingStatus;
  authUser: AuthUser;
  board: Board;
  boardStatus: LoadingStatus;
  error: any;
  projects: ProjectMap;
  user: User;
  tasks: TaskMap;
}

export interface AuthUser {
  email: string;
  displayName: string;
  photoURL: string;
  uid: string;
}

export interface Board {
  columns: Column[];
  id: string;
  isDeleted: boolean;
  projects: string[];
  showBacklog: boolean;
  title: string;
}

export interface Column {
  taskIds: string[];
  title: string;
  noOfTasksToShow?: 15 | 30 | 0 | undefined;
}

export type LoadingStatus = 'init' | 'fetching' | 'error' | 'success';

export interface Project {
  created: string;
  fullname?: string;
  id: string;
  name: string;
  owner: string;
  trelloBoardId?: string;
  type: string;
  user: string;
  listAssignments?: Dict;
}

export interface ProjectMap {
  [key: string]: Project;
}

export interface Task {
  created: string;
  description: string;
  edited: string;
  finished: string;
  id: string;
  project: string;
  status: TaskState;
  title: string;
  type: string;
  user: string;
}

export interface TaskMap {
  [key: string]: Task;
}

export enum TaskState {
  Backlog = 'Backlog',
  Todo = 'Todo',
  Doing = 'Doing',
  Done = 'Done',
}

export interface User {
  activeBoard: string;
  [key: string]: any;
}

export type ContainerState = DatabaseState;
