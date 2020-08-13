/* --- STATE --- */
export interface DatabaseState {
  authUser: AuthUser;
}

export interface AuthUser {
  [key: string]: any;
}

export type ContainerState = DatabaseState;
