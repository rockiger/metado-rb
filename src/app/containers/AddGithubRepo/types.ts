/* --- STATE --- */
export interface AddGithubRepoState {
  repos: any[];
  status: 'idle' | 'fetching' | 'error' | 'success';
}

export type ContainerState = AddGithubRepoState;
