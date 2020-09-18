/* --- STATE --- */
export interface DatabaseState {
  authUser: AuthUser;
  board: Board;
  addingProjectStatus: LoadingStatus;
  projects: ProjectMap;
  tasks: TaskMap;
  error: any;
}

export interface AuthUser {
  [key: string]: any;
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
}

export type LoadingStatus = 'init' | 'fetching' | 'error' | 'success';

export interface Project {
  created: string;
  fullname: string;
  id: string;
  name: string;
  owner: string;
  type: string;
  user: string;
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

export type ContainerState = DatabaseState;
