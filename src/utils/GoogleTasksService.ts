/* istanbul ignore file */

/* MIT License

Copyright (c) 2019 Juan Cruz Martinez 
https://github.com/bajcmartinez/google-tasks-ui/blob/master/src/services/GoogleTasks/GoogleTasksService.ts

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

import moment from 'moment';
import { Moment } from 'moment';

export class GoogleTasksService {
  private readonly clientId: string =
    '814923041781-2m58okiddrggddj4kf9ro7ra4lhvq071.apps.googleusercontent.com';

  private readonly scopes: string = 'https://www.googleapis.com/auth/tasks';

  private readonly discoveryDocs = [
    'https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest',
  ];

  private isLoaded: boolean = false;

  private auth: any;

  // @ts-ignore
  private google = window.gapi;

  /**
   * Loads the client library and gets all the api required information from google servers
   *
   */
  loadScript() {
    if (this.isLoaded) return Promise.resolve();

    const self = this;

    return new Promise((resolve, reject) => {
      // To load first we need to inject the scripts
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.async = true;
      script.defer = true;

      script.onerror = (
        event: Event | string,
        source?: string,
        lineno?: number,
        colno?: number,
        error?: Error,
      ) => {
        console.error('Error loading GAPI');
        console.error(event);
        reject(error || 'Error loading GAPI');
      };
      // @ts-ignore
      script.onload = () => {
        // Then we load the API
        // @ts-ignore
        // eslint-disable-next-line no-undef
        gapi.load('client:auth2', async () => {
          const gapiInit = async () => {
            // @ts-ignore
            // eslint-disable-next-line no-undef
            await gapi.client
              .init({
                clientId: this.clientId,
                discoveryDocs: this.discoveryDocs,
                scope: this.scopes,
              })
              .then(() => {
                // @ts-ignore
                // eslint-disable-next-line no-undef
                this.google = gapi;
                self.isLoaded = true;
                resolve();
              });
          };

          try {
            await gapiInit();
          } catch (e) {
            console.error('Error initializing GAPI');
            console.error(e);

            const retry = async () => {
              try {
                await gapiInit();
              } catch (e2) {
                reject(e2);
              }
            };

            setTimeout(retry, 2000);
          }
        });
      };

      document.body.appendChild(script);
    });
  }

  /**
   * Gets the client authorization to query google's API
   *
   */
  async load(callback: (isSignedIn: boolean) => void) {
    await this.loadScript();
    this.auth = this.google.auth2.getAuthInstance();

    this.subscribeSigninStatus(callback);
  }

  /**
   * Returns whether the current session is signed in or not
   *
   */
  isSignedIn() {
    console.log(this.auth.currentUser.get().getBasicProfile());
    if (!this.auth) return false;
    return this.auth.isSignedIn.get();
  }

  /**
   * Event listener for sign in status
   *
   * @param subscriber
   */
  subscribeSigninStatus(subscriber: (status: boolean) => void) {
    if (!this.auth) return false;
    subscriber(this.isSignedIn());
    return this.auth.isSignedIn.listen(subscriber);
  }

  /**
   * Starts the sign in process against your Google Account
   *
   */
  signIn() {
    this.auth.signIn();
  }

  /**
   * Starts the sign out process against your Google Account
   *
   */
  signOut() {
    this.auth.signOut();
  }

  /**
   * Lists all tasks lists
   *
   * @returns TaskList[]
   */
  async listTaskLists() {
    const response = await this.google.client.tasks.tasklists.list();

    return response.result.items.map(
      (item: any): TaskList =>
        ({
          id: item.id,
          title: item.title,
          updatedAt: moment(item.updated),
        } as TaskList),
    );
  }

  /**
   * Lists all tasks for a given task list
   *
   * @returns Task[]
   */
  async listTasks(taskListId: string, pageToken: string = '') {
    const response = await this.google.client.tasks.tasks.list({
      tasklist: taskListId,
      showCompleted: false,
      showHidden: true,
      pageToken,
    });

    let result: Task[] = [];

    const { items } = response.result;
    if (!items) return result;

    const nextPageToken = response.result.nextPageToken as string;

    const mapItems = (tasks: any[]): Task[] => {
      return tasks.map(
        (item: any): Task =>
          ({
            id: item.id,
            title: item.title ? item.title : '',
            notes: item.notes ? item.notes : '',
            dueAt: item.due ? moment(item.due) : undefined,
            parent: item.parent,
            completed: item.status === 'completed',
            completedAt: item.completed ? moment(item.completed) : undefined,
            updatedAt: moment(item.updated),
            listId: taskListId,
            status: item.status,
            isDirty: false,
            subtasks: mapItems(
              items.filter((subitem: any) => subitem.parent === item.id),
            ),
          } as Task),
      );
    };

    result = result.concat(
      mapItems(items.filter((subitem: any) => !subitem.parent)),
    );

    if (nextPageToken) {
      result = result.concat(await this.listTasks(taskListId, nextPageToken));
    }

    return result;
  }

  /**
   * Creates a task list
   *
   * @param taskList: TaskList
   */
  insertTaskList(taskList: TaskList) {
    return this.google.client.tasks.tasklists.insert({
      title: taskList.title,
    });
  }

  /**
   * Sets the completion status of a task
   *
   * @param task: string
   * @param tasklist: string
   * @param completed: boolean
   */
  updateTaskCompletion(task: string, tasklist: string, completed: boolean) {
    return this.google.client.tasks.tasks.update({
      tasklist,
      task,
      id: task,
      status: completed ? 'completed' : 'needsAction',
    });
  }

  /**
   * Creates a task
   *
   * @param task: Task
   */
  insertTask(task: Task) {
    return this.google.client.tasks.tasks.insert({
      tasklist: task.listId,
      task: task.id,
      id: task.id,
      title: task.title ? task.title : '',
      notes: task.notes ? task.notes : '',
      due: task.dueAt ? task.dueAt.format() : null,
      status: task.completed ? 'completed' : 'needsAction',
      parent: task.parent,
    });
  }

  /**
   * Updates a task
   *
   * @param task: Task
   */
  updateTask(task: Task) {
    return this.google.client.tasks.tasks.update({
      tasklist: task.listId,
      task: `dasdasdasdas${task.id}`,
      id: `dasdasdasdas${task.id}`,
      title: task.title,
      notes: task.notes,
      due: task.dueAt ? task.dueAt.format() : null,
      status: task.completed ? 'completed' : 'needsAction',
    });
  }

  /**
   * Deletes a task
   *
   * @param task: string
   * @param tasklist: string
   */
  deleteTask(task: string, tasklist: string) {
    return this.google.client.tasks.tasks.delete({
      tasklist,
      task,
    });
  }

  /**
   * Only used for testing purposes, view mock file
   */
  // eslint-disable-next-line class-methods-use-this
  reset() {}

  /****************************************
   * BEGIN Copyright (c) 2019 Marco Laspe *
   ****************************************/

  /**
   * Get the id oft the current authenticated user
   */
  getUserId(): string | null {
    return this.auth
      ? this.auth.currentUser.get().getBasicProfile().getId()
      : null;
  }

  /****************************************
   * END Copyright (c) 2019 Marco Laspe   *
   ****************************************/
}

const r = new GoogleTasksService();
export default r;

export type TaskList = {
  id: string;
  title: string;
  updatedAt: Moment;
};

export type Task = {
  id: string;
  title: string;
  notes?: string;
  completed: boolean;
  completedAt?: Moment;
  dueAt?: Moment;
  parent: string;
  updatedAt: Moment;
  status: string;
  listId: string;
  subtasks: Task[];
  isDirty: boolean;
};

export interface OAuthKeys {
  installed: {
    client_id: string;
    project_id: string;
    auth_uri: string;
    token_uri: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

/****************************************
 * BEGIN Copyright (c) 2019 Marco Laspe *
 ****************************************/

/****************************************
 * END Copyright (c) 2019 Marco Laspe   *
 ****************************************/
