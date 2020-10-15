import produce from 'immer';
import { PayloadAction } from '@reduxjs/toolkit';
import { eventChannel } from 'redux-saga';
import {
  all,
  call as effCall, // For workaround to overload problem, see below
  put,
  take,
  takeLatest,
  select,
} from 'redux-saga/effects';

import { reduxSagaFirebase as rsf, db } from './firebase';
import { selectUser, selectUid } from './selectors';
import { actions } from './slice';
import { Board, TaskMap, ProjectMap, TaskState, Task } from './types';
import * as githubConnector from './connectors/github';

import {
  closeIssue,
  createIssue,
  openIssue,
  updateIssue,
} from './connectors/github';

import * as googletasksConnector from './connectors/googletasks';
import { now } from 'utils/helper';

// Workaround for overload problem with call to firestore
// https://stackoverflow.com/a/58814026
export const call: any = effCall;

//////////////////
// Worker Sagas //
//////////////////

export function* addTask(action) {
  const { board, projects, taskData } = action.payload;
  const project = projects[taskData.projectId];
  const profile = yield select(selectUser);
  const uid = yield select(selectUid);

  // Create task in github and get result
  try {
    let createResult: any;
    if (project.type === 'github') {
      createResult = yield call(
        createIssue,
        profile.githubToken,
        project,
        taskData,
      );
    }
    if (project.type === 'googletasks') {
      createResult = yield call(
        googletasksConnector.createTask,
        project,
        taskData,
      );
    }
    console.log({ createResult, project });
    console.log(createResult?.status);
    if (createResult?.status >= 200 && createResult?.status < 300) {
      let newTaskId = '';
      if (project.type === 'github') {
        newTaskId = `${uid}-${project.type}-${project.owner}-${project.name}-${createResult.data.number}`;
      }
      if (project.type === 'googletasks') {
        newTaskId = `${uid}-${project.id}-${createResult.result.id}`;
      }
      // Create task in firesotere-
      console.log({ newTaskId });
      if (newTaskId) {
        const newTask: Task = {
          created: now(),
          edited: now(),
          finished: '',
          id: newTaskId,
          description: taskData.description,
          project: project.id,
          status: TaskState.Backlog,
          title: taskData.title,
          user: project.user,
        };
        const taskRef = db.collection('tasks').doc(newTaskId);
        yield call([taskRef, taskRef.set], newTask);

        // Add Task to column, needs to be after task creation,
        // otherwise we get a type error
        const column = board.columns[0];
        const newTaskIds = produce(column.taskIds, draftTaskIds => {
          draftTaskIds.push(newTaskId);
        });
        const newColumn = produce(column, draftColumn => {
          draftColumn.taskIds = newTaskIds;
        });

        const newColumns = produce(board.columns, draftColumns => {
          draftColumns[0] = newColumn;
        });

        const newBoard = produce(board, draftBoard => {
          draftBoard.columns = newColumns;
        });

        yield call(updateBoard, {
          payload: { board: newBoard, uid: project.user },
        });
      }
    }
  } catch (error) {
    console.error(error);
  }
}

export function* addGithubProject(action) {
  const { activeBoard, repo } = action.payload;
  //! add uid
  const uid = yield select(selectUid);
  const projectId = `${uid}-github-${repo.owner.login}-${repo.name}`;

  const newProject = {
    created: now(),
    fullname: repo.full_name,
    id: projectId,
    name: repo.name,
    owner: repo.owner.login,
    type: 'github',
    user: uid,
  };
  const projectsRef = db.collection('projects').doc(projectId);
  const boardRef = db
    .collection('users')
    .doc(uid)
    .collection('boards')
    .doc(activeBoard);

  try {
    yield call(
      [projectsRef, projectsRef.set],
      ...[newProject, { merge: true }],
    );
    const boardSnapshot = yield call([boardRef, boardRef.get]);
    const board = boardSnapshot.data();
    // Check if board has less than 10 projects, otherwise abort, because there
    // are only searches for 10 projects possible with firestore.
    // See syncBoardFromProviders
    if (board && board.projects && board.projects.length < 10) {
      const changedBoard = produce(board, draftBoard => {
        draftBoard.projects.push(projectId);
      });
      yield call([boardRef, boardRef.set], changedBoard);
      yield put(actions.addGithubProjectSuccess());
    } else {
      console.error('Board already has maximum of 10 projects.');
      yield put(
        actions.addGithubProjectError({
          error: 'Board already has maximum of 10 projects.',
        }),
      );
    }
  } catch (error) {
    console.error(error);
    yield put(actions.addGithubProjectError({ error }));
  }
}

export function* addGoogleTasksProject(action) {
  const { activeBoard, taskList } = action.payload;
  //! add uid
  const uid = yield select(selectUid);
  const projectId = `${uid}-googletasks-${taskList.ownerId}-${taskList.id}`;

  const newProject = {
    created: now(),
    id: projectId,
    name: taskList.title,
    owner: taskList.ownerId,
    type: 'googletasks',
    user: uid,
  };
  const projectsRef = db.collection('projects').doc(projectId);
  const boardRef = db
    .collection('users')
    .doc(uid)
    .collection('boards')
    .doc(activeBoard);

  try {
    yield call(
      [projectsRef, projectsRef.set],
      ...[newProject, { merge: true }],
    );
    const boardSnapshot = yield call([boardRef, boardRef.get]);
    const board = boardSnapshot.data();
    // Check if board has less than 10 projects, otherwise abort, because there
    // are only searches for 10 projects possible with firestore.
    // See syncBoardFromProviders
    if (board && board.projects && board.projects.length < 10) {
      const changedBoard = produce(board, draftBoard => {
        draftBoard.projects.push(projectId);
      });
      yield call([boardRef, boardRef.set], changedBoard);
      yield put(actions.addGoogleTasksProjectSuccess());
    } else {
      console.error('Board already has maximum of 10 projects.');
      yield put(
        actions.addGoogleTasksProjectError({
          error: 'Board already has maximum of 10 projects.',
        }),
      );
    }
  } catch (error) {
    console.error(error);
    yield put(actions.addGoogleTasksProjectError({ error }));
  }
}

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

export function* getProjects(action) {
  const { uid } = action.payload;

  const projectsRef = db.collection('projects').where('user', '==', uid);
  const projectsSnapshot = yield call([projectsRef, projectsRef.get]);
  let projects: ProjectMap = {};
  projectsSnapshot.forEach(doc => {
    const data = doc.data();
    projects[doc.id] = {
      ...data,
      created: convertTimestamp(data.created),
    };
  });
  yield put(actions.setProjects({ projects: projects }));
}

export function* getTasks(action) {
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

function* logout() {
  try {
    yield call(rsf.auth.signOut);
    yield put(actions.logoutSuccess());
  } catch (error) {
    console.error(error);
  }
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
    console.log('Change tasks', tasks);
    yield put(actions.setTasks({ tasks }));
  }
}

function* openUserChannel(action) {
  const { uid } = action.payload;
  const userRef = db.collection('users').doc(uid);

  // create and export channel to authUserChannel
  const channel = eventChannel(emit => userRef.onSnapshot(emit));
  yield channel;

  // get user to look if required values are there. Create them if needed.
  const user = yield call([userRef, userRef.get]);
  const { activeBoard } = user.data();
  yield put(actions.setUser({ user: user.data() }));

  console.log('open user channel', { activeBoard, userData: user.data() });
  while (true) {
    const snapshot = yield take(channel);
    yield put(actions.setUser({ user: snapshot.data() }));
  }
}

//! test
function* syncBoardFromProviders(
  action: PayloadAction<{ board: Board; tasks: TaskMap; uid: string }>,
) {
  const { board, tasks: internalTasks, uid } = action.payload;
  const projectIds = board.projects;
  const profile = yield select(selectUser);

  try {
    for (const projectId of projectIds) {
      const [, projectType] = projectId.split('-');
      if (projectType === 'github' && profile.githubToken) {
        yield call(
          githubConnector.sync,
          db,
          internalTasks,
          projectId,
          uid,
          profile.githubToken,
        );
      }
      if (projectType === 'googletasks') {
        yield call(
          googletasksConnector.sync,
          db,
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
        // projectIds can't be longer then 10, otherwise firestore
        // throws an erro. If more projects are needed. This call needs
        // to be rewritten.
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

function* updateActiveBoard(
  action: PayloadAction<{ boardId: string; uid: string }>,
) {
  const { boardId, uid } = action.payload;
  const userRef = db.collection('users').doc(uid);
  try {
    yield call(
      [userRef, userRef.set],
      { activeBoard: boardId },
      { merge: true },
    );
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
  const { oldTask, projects, task } = action.payload;
  const profile = yield select(selectUser);
  const project = projects[oldTask.project];
  const taskRef = db.collection('tasks').doc(task.id);
  try {
    yield call([taskRef, taskRef.set], task);
    if (task.id.startsWith('github') && profile.githubToken) {
      if (oldTask.status === TaskState.Done && task.status !== TaskState.Done) {
        yield call(openIssue, profile.githubToken, task, project);
      }
      if (oldTask.status !== TaskState.Done && task.status === TaskState.Done) {
        yield call(closeIssue, profile.githubToken, task, project);
      }
      if (
        oldTask.title !== task.title ||
        oldTask.description !== task.description
      ) {
        yield call(updateIssue, profile.githubToken, task, project);
      }
    }
    if (task.id.startsWith('googletasks')) {
      yield call(googletasksConnector.updateTask, task, project);
    }
  } catch (error) {
    console.error(error);
  }
}

function* updateUserCredentials(action) {
  const { uid, displayName, email } = action.payload;
  const userRef = db.collection('users').doc(uid);
  try {
    const user = yield call([userRef, userRef.get]);
    console.log('updateUserCredenttials', { user });
    yield call([userRef, userRef.set], { email, displayName }, { merge: true });
  } catch (error) {
    console.error(error);
  }
}

///////////////////
// Watcher Sagas //
///////////////////

function* databaseWatcherSaga() {
  yield takeLatest(actions.addGithubProject.type, addGithubProject);
  yield takeLatest(actions.addGoogleTasksProject.type, addGoogleTasksProject);
  yield takeLatest(actions.addTask.type, addTask);
  yield takeLatest(actions.getProjects.type, getProjects);
  yield takeLatest(actions.logout.type, logout);
  yield takeLatest(actions.openBoardChannel.type, openBoardChannel);
  yield takeLatest(actions.openTasksChannel.type, openTasksChannel);
  yield takeLatest(actions.syncBoardFromProviders, syncBoardFromProviders);
  yield takeLatest(actions.updateActiveBoard.type, updateActiveBoard);
  yield takeLatest(actions.updateBoard.type, updateBoard);
  yield takeLatest(actions.updateTask.type, updateTask);
  yield takeLatest(actions.updateUserCredentials.type, updateUserCredentials);
}

function* syncAuthUserSaga() {
  let userChannel: any = null;
  const channel = yield call(rsf.auth.channel);
  console.log('open auth channel');

  while (true) {
    const { error, user } = yield take(channel);
    console.log('update user', { error, user });
    if (user) {
      console.log(user);
      const { email, displayName, photoURL, uid } = user;
      yield put(
        actions.syncAuthUser({
          email,
          displayName,
          photoURL,
          uid,
        }),
      );
      if (uid) {
        userChannel = yield call(openUserChannel, {
          payload: { uid },
        });
      } else {
        userChannel?.close && userChannel.close();
      }
      console.log({ userChannel });
    } else {
      yield put(actions.syncAuthUserError(error));
      userChannel?.close && userChannel.close();
    }
  }
}

export function* databaseSaga() {
  yield all([, /* syncAuthUserSaga() */ databaseWatcherSaga()]);
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
 */
export function correctPositionsInBoard(board: Board, tasks: Task[]): Board {
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

export function correctPositionsInBoardHelper(board: Board, task: Task) {
  let needsUpdate = false;
  const columns = board.columns.map(col => {
    const column = { ...col };
    const taskIndex = column.taskIds.indexOf(task.id);
    if (column.title === task.status) {
      if (taskIndex !== -1) {
        return column;
      } else {
        needsUpdate = true;
        return { ...column, taskIds: [...column.taskIds, task.id] };
      }
    } else {
      if (column.taskIds.indexOf(task.id) !== -1) {
        needsUpdate = true;
        return {
          ...column,
          taskIds: [
            ...column.taskIds.slice(0, taskIndex),
            ...column.taskIds.slice(taskIndex + 1),
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
