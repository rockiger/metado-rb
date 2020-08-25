import { Task, TaskState } from '../types';
import { createOrUpdateTask } from '../connectors/github';

describe('createOrUpdateTask', () => {
  it('should only handle tasks were external and internal tasks differ', () => {
    const githubTask = {
      number: '100',
      state: 'open',
      title: 'Found a bug',
      body: "I'm having a problem with this.",
    };
    const internalTask: Task = {
      created: 'string',
      description: "I'm having a problem with this.",
      edited: 'string',
      finished: 'string',
      id: 'github-octocat-helloworld-100',
      project: 'helloworld',
      status: TaskState.Doing,
      title: 'Found a bug',
      user: 'string',
    };
    expect(
      createOrUpdateTask(
        githubTask,
        { 'github-octocat-helloworld-100': internalTask },
        'github-octocat-helloworld',
        '1234567890',
      ),
    ).toBeNull();
  });

  it('should change title, state and description', () => {
    const githubTask = {
      number: '100',
      state: 'open',
      title: 'Found a bug',
      body: "I'm having a problem with this.",
    };
    const internalTask: Task = {
      created: 'string',
      description: "I'm a lot having a problem with this.",
      edited: 'string',
      finished: 'string',
      id: 'github-octocat-helloworld-100',
      project: 'helloworld',
      status: TaskState.Done,
      title: 'Found another bug',
      user: 'string',
    };
    const changedTask: Task = {
      created: 'string',
      description: "I'm having a problem with this.",
      edited: 'string',
      finished: 'string',
      id: 'github-octocat-helloworld-100',
      project: 'helloworld',
      status: TaskState.Backlog,
      title: 'Found a bug',
      user: 'string',
    };
    expect(
      createOrUpdateTask(
        githubTask,
        { 'github-octocat-helloworld-100': internalTask },
        'github-octocat-helloworld',
        '1234567890',
      ),
    ).toEqual(changedTask);
  });

  it('should should produce a new task if there is no corresponding task', () => {
    const githubTask = {
      number: '100',
      state: 'open',
      title: 'Found a bug',
      body: "I'm having a problem with this.",
      created_at: '2011-01-26T19:01:12Z',
      updated_at: '2011-01-26T19:14:43Z',
    };
    const createdTask: Task = {
      description: "I'm having a problem with this.",
      id: 'github-octocat-helloworld-100',
      project: 'github-octocat-helloworld',
      status: TaskState.Backlog,
      title: 'Found a bug',
      user: '1234567890',
      created: new Date('2011-01-26T19:01:12Z').toISOString(),
      edited: new Date('2011-01-26T19:14:43Z').toISOString(),
      finished: '',
    };
    expect(
      createOrUpdateTask(
        githubTask,
        {},
        'github-octocat-helloworld',
        '1234567890',
      ),
    ).toEqual(createdTask);
  });
});
