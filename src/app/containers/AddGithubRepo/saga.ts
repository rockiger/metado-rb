import { take, call, put, select, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';

export function* fetchGithubRepos(action) {
  const { githubToken } = action.payload;
  const getReposFromGithub = () =>
    fetch('https://api.github.com/user/repos?per_page=100', {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    }).then(res => res.json());
  try {
    const repos: any[] = yield call(getReposFromGithub);
    console.log(repos);
    yield put(actions.fetchGithubReposSuccess({ repos }));
  } catch (error) {
    console.error(error);
    yield put(actions.fetchGithubReposError(error));
  }
}

export function* addGithubRepoSaga() {
  yield takeLatest(actions.fetchGithubRepos.type, fetchGithubRepos);
}
