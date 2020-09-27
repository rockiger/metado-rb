import { Task, TaskMap, TaskState, Project } from '../types';
import produce from 'immer';
import * as _ from 'lodash';

export { createOrUpdateTask, syncGithub, closeIssue, openIssue };

/**
 * Sync all issues from a given github repo with our tasks database.
 */
//! rewrite to sage to make it testable
async function syncGithub(
  db: any,
  internalTasks: TaskMap,
  projectId: string,
  uid: string,
  githubToken: string,
) {
  const [, userName, projectName] = projectId.split('-');
  const repoFullname = `${userName}/${projectName}`;
  const externalTasks = await fetchIssuesFromGithubRepo(
    repoFullname,
    githubToken,
  );
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
}

/**
 * Check if a github issue is represented in our tasks and if they values
 * correspond to the values in the github issues. If not a corrected version is produced.
 * If there is no task a new one is created. If there is nothing to do null is returned.
 */
function createOrUpdateTask(
  externalTask: { [key: string]: string },
  internalTasks: TaskMap,
  projectId: string,
  uid: string,
): Task | null {
  const internalTaskId = `${projectId}-${externalTask.number}`;
  const internalTask = internalTasks[internalTaskId];
  if (internalTask) {
    if (
      (externalTask.state === 'open' &&
        internalTask.status === TaskState.Done) ||
      (externalTask.state === 'closed' &&
        internalTask.status !== TaskState.Done) ||
      externalTask.title !== internalTask.title ||
      externalTask.body !== internalTask.description
    ) {
      let changedTask = produce<Task>(internalTask, (draftTask: Task) => {
        if (
          externalTask.state === 'open' &&
          draftTask.status === TaskState.Done
        ) {
          draftTask.status = TaskState.Backlog;
        }
        if (
          externalTask.state === 'closed' &&
          draftTask.status !== TaskState.Done
        ) {
          draftTask.status = TaskState.Done;
        }
        if (externalTask.body !== draftTask.description) {
          draftTask.description = externalTask.body;
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
      externalTask.state === 'open' ? TaskState.Backlog : TaskState.Done;
    const created = new Date(externalTask.created_at).toISOString();
    const edited = new Date(externalTask.updated_at).toISOString();
    const finished = externalTask.closed_at
      ? new Date(externalTask.closed_at).toISOString()
      : '';
    const newTask: Task = {
      created,
      edited,
      finished,
      id: internalTaskId,
      description: externalTask.body,
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

async function closeIssue(
  githubToken: string,
  issueData: Task,
  project: Project,
) {
  const { name: repo, owner } = project;
  const issueNumber = _.last(issueData.id.split('-'));

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
    {
      body: JSON.stringify({
        state: 'closed',
      }),
      headers: {
        Authorization: `token ${githubToken}`,
      },
      method: 'PATCH',
    },
  );

  console.log(response);
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

async function openIssue(
  githubToken: string,
  issueData: Task,
  project: Project,
) {
  const { name: repo, owner } = project;
  const issueNumber = _.last(issueData.id.split('-'));

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
    {
      body: JSON.stringify({
        state: 'open',
      }),
      headers: {
        Authorization: `token ${githubToken}`,
      },
      method: 'PATCH',
    },
  );

  console.log(response);
}

export async function updateIssue(
  githubToken: string,
  issueData: Task,
  project: Project,
) {
  const { name: repo, owner } = project;
  const issueNumber = _.last(issueData.id.split('-'));
  const { title, description: body } = issueData;

  const response = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/issues/${issueNumber}`,
    {
      body: JSON.stringify({
        title,
        body,
      }),
      headers: {
        Authorization: `token ${githubToken}`,
      },
      method: 'PATCH',
    },
  );

  console.log(response);
}
