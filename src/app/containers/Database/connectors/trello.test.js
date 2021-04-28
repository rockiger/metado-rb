import { Task, TaskMap, TaskState, Project } from '../types';
import { getExternalTaskStatus } from './trello';

describe('getExternalTaskStatus', () => {
  const project = {
    listAssignments: {
      0: 'Backlog',
      1: 'Todo',
      2: 'Doing',
      3: 'Done',
    },
  };
  test('idList undefined or different than 0 to 3 => Backlog', () => {
    expect(getExternalTaskStatus({}, project)).toEqual('Backlog');
    expect(getExternalTaskStatus({ idList: '4' }, project)).toEqual('Backlog');
  });
  test('idList 0 => Backlog', () => {
    expect(getExternalTaskStatus({ idList: '0' }, project)).toEqual('Backlog ');
  });
  test('idList 1 => Todo', () => {
    expect(getExternalTaskStatus({ idList: '1' }, project)).toEqual('Todo');
  });
  test('idList 2 => Doing', () => {
    expect(getExternalTaskStatus({ idList: '2' }, project)).toEqual('Doing');
  });
  test('idList 3 => Done', () => {
    expect(getExternalTaskStatus({ idList: '3' }, project)).toEqual('Done');
  });
});
