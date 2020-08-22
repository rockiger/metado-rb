import { PayloadAction } from '@reduxjs/toolkit';
import { eventChannel } from 'redux-saga';
import { all, call, put, take, takeLatest, select } from 'redux-saga/effects';

import { reduxSagaFirebase as rsf, fireStore as db } from './firebase';
import { selectUserProfile } from './selectors';
import { actions } from './slice';
import { Board, TaskMap } from './types';
import { syncGithub } from './connectors/github';

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

function* openBoardChannel(action) {
  const { uid, boardId } = action.payload;

  const boardRef = db
    .collection('users')
    .doc(uid)
    .collection('boards')
    .doc(boardId);

  const channel = eventChannel(emit => boardRef.onSnapshot(emit));
  console.log('open board channel');

  yield takeLatest(actions.closeBoardChannel.type, function () {
    console.log('close board channel');
    channel.close();
  });

  while (true) {
    const snapshot = yield take(channel);
    console.log(snapshot.data());
    yield put(actions.setBoard({ board: snapshot.data() }));
  }
}

function* openTasksChannel(action) {
  const { uid, projectIds } = action.payload;

  const tasksRef = db
    .collection('tasks')
    .where('project', 'in', projectIds)
    .where('user', '==', uid);

  const channel = eventChannel(emit => tasksRef.onSnapshot(emit));
  console.log('open tasks channel');

  yield takeLatest(actions.closeTasksChannel.type, function () {
    console.log('close tasks channel');
    channel.close();
  });

  while (true) {
    const snapshot = yield take(channel);
    let tasks: TaskMap = {};
    snapshot.forEach(doc => {
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
}

function* syncBoardFromProviders(
  action: PayloadAction<{ board: Board; tasks: TaskMap; uid: string }>,
) {
  const { board, tasks: internalTasks, uid } = action.payload;
  const projectIds = board.projects;
  const profile = yield select(selectUserProfile);

  try {
    for (const projectId of projectIds) {
      const [projectType] = projectId.split('-');
      if (projectType === 'github' && profile.githubToken) {
        yield call(
          syncGithub,
          db,
          profile.githubToken,
          internalTasks,
          projectId,
          uid,
        );
      }

      // correctPositionInBoard
      // get tasks of this board
      let updatedTasks: any[] = [];
      const updatedTasksRef = db
        .collection('tasks')
        .where('project', 'in', projectIds)
        .where('user', '==', uid);
      const updatedTaskQuery = yield call([
        updatedTasksRef,
        updatedTasksRef.get,
      ]);
      updatedTaskQuery.forEach(
        doc => doc.data && updatedTasks.push(doc.data()),
      );
      const updatedBoard = correctPositionsInBoard(board, updatedTasks);
      yield put(actions.setBoard({ board: updatedBoard }));

      const saveBoardRef = db
        .collection('users')
        .doc(uid)
        .collection('boards')
        .doc(updatedBoard.id);
      yield call([saveBoardRef, saveBoardRef.set], updatedBoard);
    }
  } catch (error) {
    console.error(error);
  }
}

function* updateBoard(action) {
  console.log('updateBoard', { action });
  const { board, uid } = action.payload;
  const boardRef = db
    .collection('users')
    .doc(uid)
    .collection('boards')
    .doc(board.id);
  try {
    yield call([boardRef, boardRef.set], board);
  } catch (error) {
    console.error(error);
  }
}

function* updateTask(action) {
  console.log('updateTask', { action });
  const { task } = action.payload;
  const taskRef = db.collection('tasks').doc(task.id);
  try {
    yield call([taskRef, taskRef.set], task);
  } catch (error) {
    console.error(error);
  }
}

///////////////////
// Watcher Sagas //
///////////////////

function* databaseWatcherSaga() {
  yield takeLatest(actions.openBoardChannel.type, openBoardChannel);
  yield takeLatest(actions.openTasksChannel.type, openTasksChannel);
  yield takeLatest(actions.syncBoardFromProviders, syncBoardFromProviders);
  yield takeLatest(actions.updateBoard.type, updateBoard);
  yield takeLatest(actions.updateTask.type, updateTask);
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

/**
 * Check for all given tasks if they have the right position in the given board
 * @param {Object.<string, any>} board
 * @param {import('./board-utils').Task[]} tasks
 * @returns board
 */
function correctPositionsInBoard(board, tasks) {
  let updatedBoard = { ...board };
  for (const task of tasks) {
    const { needsUpdate, columns } = correctPositionsInBoardHelper(
      updatedBoard,
      task,
    );
    if (needsUpdate) {
      updatedBoard = { ...updatedBoard, columns };
    }
  }
  return updatedBoard;
}

function correctPositionsInBoardHelper(board, task) {
  let needsUpdate = false; //
  const columns = board.columns.map(col => {
    const column = { ...col };
    const index = column.taskIds.indexOf(task.id);
    if (column.title === task.status) {
      if (index !== -1) {
        return column;
      } else {
        needsUpdate = true;
        console.log('Add: ', task.id, ' to ', column.title);
        return { ...column, taskIds: [...column.taskIds, task.id] };
      }
    } else {
      if (column.taskIds.indexOf(task.id) !== -1) {
        needsUpdate = true;
        console.log('Remove: ', task.id, ' from ', column.title);
        console.log(column.taskIds);
        return {
          ...column,
          taskIds: [
            ...column.taskIds.slice(0, index),
            ...column.taskIds.slice(index + 1),
          ],
        };
      } else {
        return column;
      }
    }
  });
  return {
    needsUpdate,
    columns,
  };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getColumnPosition(columns, column) {
  return columns.findIndex(col => col.title === column.title);
}
