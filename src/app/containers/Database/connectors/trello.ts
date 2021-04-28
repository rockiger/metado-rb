import { Task, TaskMap, TaskState, Project } from '../types';
import produce from 'immer';
import * as _ from 'lodash';

export { createOrUpdateTask };

/**
 * Sync all issues from a given github repo with our tasks database.
 */
export async function sync(
  db: any,
  internalTasks: TaskMap,
  project: Project,
  uid: string,
  trelloToken: string,
) {
  console.log({ project });
  const externalTasks = await fetchCardsFromTrelloBoard(
    project.trelloBoardId,
    trelloToken,
  );
  for (const externalTask of externalTasks) {
    //!
    const newOrUpdatedTask = createOrUpdateTask(
      externalTask,
      internalTasks,
      project,
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
  project: Project,
  uid: string,
): Task | null {
  const internalTaskId = `${project.id}-${externalTask.id}`;
  const internalTask = internalTasks[internalTaskId];
  const externalTaskStatus = getExternalTaskStatus(externalTask, project);
  console.log({ externalTask, externalTaskStatus, project });
  if (internalTask) {
    if (
      externalTaskStatus !== internalTask.status ||
      externalTask.name !== internalTask.title ||
      externalTask.desc !== internalTask.description
    ) {
      let changedTask = produce<Task>(internalTask, (draftTask: Task) => {
        if (externalTaskStatus !== internalTask.status) {
          draftTask.status = externalTaskStatus;
        }
        if (externalTask.desc !== draftTask.description) {
          draftTask.description = externalTask.desc;
        }
        if (externalTask.name !== draftTask.title) {
          draftTask.title = externalTask.name;
        }
      });
      return changedTask;
    } else {
      return null;
    }
  } else {
    const created = new Date(externalTask.dateLastActivity).toISOString();
    const edited = new Date(externalTask.dateLastActivity).toISOString();
    const finished =
      externalTaskStatus === TaskState.Done
        ? new Date(externalTask.dateLastActivity).toISOString()
        : '';
    const newTask: Task = {
      created,
      edited,
      finished,
      id: internalTaskId,
      description: externalTask.desc,
      project: project.id,
      status: externalTaskStatus,
      title: externalTask.name,
      type: 'trello',
      user: uid,
    };
    return newTask;
  }
}

async function fetchCardsFromTrelloBoard(boardId, trelloToken) {
  let externalTasks: any[] = [];
  console.log('fetchTrello');
  const response = await fetch(
    `https://api.trello.com/1/boards/${boardId}/cards?key=8204045abe5fcaf65f6d744dd8ff74c4&token=${trelloToken}`,
  );
  console.log(response);
  const json = await response.json();
  console.log({ json });
  externalTasks = [...json];
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

export const getExternalTaskStatus = (
  externalTask: { [key: string]: string },
  project: Project,
): TaskState =>
  (project?.listAssignments && project?.listAssignments[externalTask.idList]) ??
  TaskState.Backlog;
