import { Task, TaskMap, TaskState, Project } from '../types';
import produce from 'immer';

import GoogleTasksService, {
  Task as GoogleTask,
} from 'utils/GoogleTasksService';
import { now } from 'utils/helper';

/**
 * Sync all tasks from a given Google Task list with our tasks database.
 */
//! rewrite to sage to make it testable
export async function sync(
  db: any,
  internalTasks: TaskMap,
  projectId: string,
  uid: string,
) {
  const [, , , taskListId] = projectId.split('-');
  GoogleTasksService.load(() => {})
    .catch(error => {
      console.error('Error loading google services:', error);
    })
    .then(async () => {
      try {
        const externalTasks = await GoogleTasksService.listTasks(taskListId);
        // console.log('Google sync', { externalTasks });
        for (const externalTask of externalTasks) {
          const newOrUpdatedTask = createOrUpdateTask(
            externalTask,
            internalTasks,
            projectId,
            uid,
          );
          if (!!newOrUpdatedTask) {
            await db
              .collection('tasks')
              .doc(newOrUpdatedTask.id)
              .set(newOrUpdatedTask);
          }
        }
      } catch (error) {
        if (error?.result?.error?.errors[0]?.message === 'Login Required.') {
          GoogleTasksService.subscribeSigninStatus(isSignedIn => {
            if (isSignedIn) window.location.reload();
          });
          await GoogleTasksService.signIn();
        } else {
          console.error({ error });
        }
      }
    });
}

/**
 * Check if a github issue is represented in our tasks and if they values
 * correspond to the values in the github issues. If not a corrected version is produced.
 * If there is no task a new one is created. If there is nothing to do null is returned.
 */
export function createOrUpdateTask(
  externalTask: GoogleTask,
  internalTasks: TaskMap,
  projectId: string,
  uid: string,
): Task | null {
  const internalTaskId = `${projectId}-${externalTask.id}`;
  const internalTask = internalTasks[internalTaskId];
  if (internalTask) {
    if (
      (externalTask.status === 'needsAction' &&
        internalTask.status === TaskState.Done) ||
      (externalTask.status === 'completed' &&
        internalTask.status !== TaskState.Done) ||
      externalTask.title !== internalTask.title ||
      externalTask.notes !== internalTask.description
    ) {
      let changedTask = produce<Task>(internalTask, (draftTask: Task) => {
        if (
          externalTask.status === 'needsAction' &&
          draftTask.status === TaskState.Done
        ) {
          draftTask.status = TaskState.Backlog;
        }
        if (
          externalTask.status === 'completed' &&
          draftTask.status !== TaskState.Done
        ) {
          draftTask.status = TaskState.Done;
        }
        if (externalTask.notes !== draftTask.description) {
          draftTask.description = externalTask.notes || '';
        }
        if (externalTask.title !== draftTask.title) {
          draftTask.title = externalTask.title;
        }
      });
      return changedTask;
    } else {
      return null;
    }
  } else {
    const status =
      externalTask.status === 'needsAction'
        ? TaskState.Backlog
        : TaskState.Done;
    const created = new Date(externalTask.updatedAt).toISOString();
    const edited = new Date(externalTask.updatedAt).toISOString();
    const finished = externalTask.completed
      ? new Date(externalTask.completedAt || '').toISOString()
      : '';
    const newTask: Task = {
      created,
      edited,
      finished,
      id: internalTaskId,
      description: externalTask.notes || '',
      project: projectId,
      status,
      title: externalTask.title,
      type: 'googletasks',
      user: uid,
    };
    return newTask;
  }
}

export async function createTask(project: Project, taskData) {
  return GoogleTasksService.load(() => {})
    .catch(async error => {
      console.error('Error loading google services:', error);
    })
    .then(async () => {
      return await createTaskHelper(project, taskData);
    });
}

async function createTaskHelper(project: Project, taskData: any) {
  const [, , , listId] = project.id.split('-');
  const task = {
    id: '',
    title: taskData.title,
    notes: taskData.description,
    completed: false,
    parent: '',
    updatedAt: taskData.edited || now(),
    status: 'needsAction',
    listId: listId,
    subtasks: [],
    isDirty: false,
  };

  let response: any;
  try {
    response = await GoogleTasksService.insertTask(task);
  } catch (error) {
    console.error('Error loading google services:', error);
    if (error?.result?.error?.status === 'UNAUTHENTICATED') {
      console.log('Unauthenticated, try to sign in.');
      await GoogleTasksService.reloadAuth();
      console.log('Signed in, try to update task again once.');
      response = await GoogleTasksService.insertTask(task);
    }
  }
  console.log(response);
  return response;
}

export async function updateTask(taskData: Task, project: Project) {
  return GoogleTasksService.load(() => {})
    .catch(async error => {
      console.error('Error loading google services:', error);
    })
    .then(async () => {
      return await updateHelper(taskData);
    });
}

async function updateHelper(taskData: Task) {
  //! Could be a problem if name of taskslist has a hyphen
  const [, , , listId, taskId] = taskData.id.split('-');
  console.log({ listId, taskId });
  const task = {
    id: taskId,
    title: taskData.title,
    notes: taskData.description,
    completed: taskData.status === 'Done',
    completedAt: taskData.finished,
    parent: '',
    updatedAt: taskData.edited || now(),
    status: taskData.status === 'Done' ? 'completed' : 'needsAction',
    listId: listId,
    subtasks: [],
    isDirty: false,
  };
  console.log('await GoogleTasksService.updateTask(task);');
  try {
    await GoogleTasksService.updateTask(task);
  } catch (error) {
    console.error('Error loading google services:', error);
    if (error?.result?.error?.status === 'UNAUTHENTICATED') {
      console.log('Unauthenticated, try to sign in.');
      await GoogleTasksService.reloadAuth();
      console.log('Signed in, try to update task again once.');
      await GoogleTasksService.updateTask(task);
    }
  }
}
