import { take, call, put, all } from 'redux-saga/effects';
import { actions } from './slice';

import { reduxSagaFirebase as rsf, fireStore as db } from './firebase';
// export function* doSomething() {}

console.log({ db });

function* syncUserSaga() {
  const channel = yield call(rsf.auth.channel);
  while (true) {
    const { error, user } = yield take(channel);
    //! get grofile and

    if (user) {
      const profileRef = db.collection('users').doc(user.uid);
      const profileSnapshot = yield call([profileRef, profileRef.get]);
      const profile = profileSnapshot.data();
      console.log(profile);
      yield put(actions.syncUser({ ...user.toJSON(), profile }));
    } else yield put(actions.syncUserError(error));
  }
}

export function* databaseSaga() {
  yield all([syncUserSaga()]);
  // yield takeLatest(actions.someAction.type, doSomething);
}
