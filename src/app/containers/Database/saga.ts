import { all, call, put, take, takeLatest } from 'redux-saga/effects';
import { actions } from './slice';

import { reduxSagaFirebase as rsf, fireStore as db } from './firebase';
import { TaskMap } from './types';

//////////////////
// Worker Sagas //
//////////////////

export function* getBoard(action) {
  console.log({ action });
  const { uid, boardId } = action.payload;

  const boardRef = db
    .collection('users')
    .doc(uid)
    .collection('boards')
    .doc(boardId);
  const boardSnapshot = yield call([boardRef, boardRef.get]);
  const board = boardSnapshot.data();
  yield put(actions.setBoard({ board }));
}

export function* getTasks(action) {
  console.log({ action });
  const { uid, projectIds } = action.payload;

  const tasksRef = db
    .collection('tasks')
    .where('project', 'in', projectIds)
    .where('user', '==', uid);
  const taskSnapshot = yield call([tasksRef, tasksRef.get]);
  let tasks: TaskMap = {};
  taskSnapshot.forEach(doc => {
    const data = doc.data();
    tasks[doc.id] = {
      ...data,
      created: convertTimestamp(data.created),
      edited: convertTimestamp(data.edited),
      finished: convertTimestamp(data.finished),
    };
  });
  yield put(actions.setTasks({ tasks }));
}

///////////////////
// Watcher Sagas //
///////////////////

function* databaseWatcherSaga() {
  yield takeLatest(actions.getBoard.type, getBoard);
  yield takeLatest(actions.getTasks.type, getTasks);
}

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
  yield all([syncUserSaga(), databaseWatcherSaga()]);
}

////////////
// Helper //
////////////

function convertTimestamp(date) {
  if (!date) return '';
  if (typeof date === 'string') return date;
  if (date && date.toDate()) {
    return date.toDate().toISOString();
  }
  return '';
}
