import { take, call, put, all } from 'redux-saga/effects';
import { actions } from './slice';

import { reduxSagaFirebase as rsf, fireStore } from './firebase';
// export function* doSomething() {}

console.log({ fireStore });
function* syncUserSaga() {
  const channel = yield call(rsf.auth.channel);

  while (true) {
    const { error, user } = yield take(channel);

    if (user) yield put(actions.syncUser(user.toJSON()));
    else yield put(actions.syncUserError(error));
  }
}

export function* databaseSaga() {
  yield all([syncUserSaga()]);
  // yield takeLatest(actions.someAction.type, doSomething);
}
