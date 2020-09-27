import { Task, TaskMap, TaskState, Project } from '../types';
import produce from 'immer';
import * as _ from 'lodash';

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
  const [, , taskListId] = projectId.split('-');
  GoogleTasksService.load(() => {})
    .catch(error => {
      console.error('Error loading google services:', error);
      GoogleTasksService.signIn();
    })
    .then(async () => {
      const externalTasks = await GoogleTasksService.listTasks(taskListId);
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
      user: uid,
    };
    return newTask;
  }
}

async function fetchIssuesFromGithubRepo(repoFullname, githubToken) {
  const response = await fetch(
    `https://api.github.com/repos/${repoFullname}/issues?state=all`,
    {
      headers: {
        Authorization: `token ${githubToken}`,
      },
    },
  );
  const externalTasks: any[] = await response.json();
  return externalTasks;
}

export async function createIssue(githubToken, project: Project, issueData) {
  const { name: repo, owner } = project;
  const { title, description: body } = issueData;
  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues`,
    {
      body: JSON.stringify({
        title,
        body,
      }),
      headers: {
        Authorization: `token ${githubToken}`,
      },
      method: 'POST',
    },
  );
  const data = await response.json();
  return { status: response.status, data };
}

export async function updateTask(taskData: Task, project: Project) {
  GoogleTasksService.load(() => {})
    .catch(error => {
      console.error('Error loading google services:', error);
      GoogleTasksService.signIn();
    })
    .then(async () => {
      const [, , listId, taskId] = taskData.id.split('-');
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
      await GoogleTasksService.updateTask(task);
    });
}
