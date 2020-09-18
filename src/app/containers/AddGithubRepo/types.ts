/* --- STATE --- */
export interface AddGithubRepoState {
  repos: any[];
  status: 'init' | 'fetching' | 'error' | 'success';
}

export type ContainerState = AddGithubRepoState;
