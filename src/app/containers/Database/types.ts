/* --- STATE --- */
export interface DatabaseState {
  authUser: { [key: string]: any };
}

export type ContainerState = DatabaseState;
