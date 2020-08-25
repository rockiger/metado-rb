import produce from 'immer';

import {
  correctPositionsInBoard,
  correctPositionsInBoardHelper,
} from '../saga';
import { Board, Task, TaskMap, TaskState } from '../types';

const board: Board = {
  projects: ['github-rockiger-metado', 'github-rockiger-junto'],
  columns: [
    {
      taskIds: [
        'github-rockiger-junto-133',
        'github-rockiger-junto-136',
        'github-rockiger-junto-109',
      ],
      title: 'Backlog',
    },
    {
      taskIds: [
        'github-rockiger-junto-135',
        'github-rockiger-junto-140',
        'github-rockiger-junto-141',
      ],
      title: 'Todo',
    },
    {
      taskIds: [
        'github-rockiger-junto-147',
        'github-rockiger-metado-10',
        'github-rockiger-junto-113',
      ],
      title: 'Doing',
    },
    {
      taskIds: [
        'github-rockiger-junto-142',
        'github-rockiger-junto-131',
        'github-rockiger-junto-117',
      ],
      title: 'Done',
    },
  ],
  title: 'Main Board',
  showBacklog: true,
  id: 'main-board',
  isDeleted: false,
};

const tasks: Task[] = [
  {
    status: TaskState.Backlog,
    created: '2020-04-16T22:43:08.000Z',
    finished: '',
    title: 'Refactor Login with react-google-login',
    project: 'github-rockiger-junto',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    id: 'github-rockiger-junto-133',
    description: 'https://www.npmjs.com/package/react-google-login',
    edited: '2020-04-16T22:43:08.000Z',
  },
  {
    project: 'github-rockiger-junto',
    status: TaskState.Backlog,
    edited: '2020-05-22T07:18:29.000Z',
    title: 'Show current directory in Header',
    description:
      'As a user I want to see, I which directory I am in the moment. ',
    created: '2020-05-22T07:18:29.000Z',
    id: 'github-rockiger-junto-136',
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
  },
  {
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-02-03T21:16:43.000Z',
    project: 'github-rockiger-junto',
    description: '',
    id: 'github-rockiger-junto-109',
    edited: '2020-02-03T21:16:43.000Z',
    status: TaskState.Backlog,
    title: 'Test TestingCafe, maybe it works better with Google Drive',
  },
  {
    project: 'github-rockiger-junto',
    title: 'Bookmarking Pages',
    edited: '2020-05-22T07:17:21.000Z',
    created: '2020-05-22T07:17:21.000Z',
    status: TaskState.Todo,
    id: 'github-rockiger-junto-135',
    finished: '',
    description:
      'As a user, I want to bookmark pages. To have a list of especially interesting pages.',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
  },
  {
    description:
      'Ben want to tag his wiki pages, that he can group them logically.',
    title: 'Tagging',
    id: 'github-rockiger-junto-140',
    project: 'github-rockiger-junto',
    edited: '2020-06-12T17:41:44.000Z',
    created: '2020-06-12T17:41:44.000Z',
    status: TaskState.Todo,
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    finished: '',
  },
  {
    description: '',
    status: TaskState.Todo,
    edited: '2020-06-12T19:43:37.000Z',
    created: '2020-06-12T19:43:37.000Z',
    project: 'github-rockiger-junto',
    title: 'Rework the onboarding like other GSuite extensions',
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    id: 'github-rockiger-junto-141',
  },
  {
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-07-23T07:20:13.000Z',
    edited: '2020-07-23T07:20:13.000Z',
    id: 'github-rockiger-junto-147',
    finished: '',
    title:
      'Problems with image pasting. Content is duplicated when pasted image is present in Text',
    project: 'github-rockiger-junto',
    status: TaskState.Doing,
    description: '',
  },
  {
    id: 'github-rockiger-metado-10',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    edited: '2020-02-09T23:41:04.000Z',
    title:
      'Refactor search and filelist with search term in url. That the user can use the browser back and forward button and make searches linkable.',
    created: '2020-02-09T23:41:04.000Z',
    project: 'github-rockiger-junto',
    finished: '',
    status: TaskState.Doing,
    description: '',
  },
  {
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    project: 'github-rockiger-junto',
    id: 'github-rockiger-junto-113',
    title: 'Move pages',
    created: '2020-02-07T02:05:42.000Z',
    status: TaskState.Doing,
    description: '',
    edited: '2020-05-08T09:07:18.000Z',
  },
  {
    project: 'github-rockiger-junto',
    id: 'github-rockiger-junto-142',
    status: TaskState.Done,
    description: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    finished: '',
    title:
      'Write test for getFolderId in SidebarTree-helper, to find the problem why it shows pages without childs as subfolders. ',
    created: '2020-06-22T21:06:35.000Z',
    edited: '2020-06-22T21:06:35.000Z',
  },
  {
    edited: '2020-03-19T23:15:05.000Z',
    project: 'github-rockiger-junto',
    title: "When I add a new page it doesn't has a parent.",
    id: 'github-rockiger-junto-131',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    status: TaskState.Done,
    description: '',
    finished: '',
    created: '2020-03-16T21:32:42.000Z',
  },
  {
    created: '2020-02-17T22:17:51.000Z',
    description:
      '\r\n![image](https://user-images.githubusercontent.com/458677/82642361-0ecccf00-9c0e-11ea-8a5f-c3a4ebc2ab79.png)\r\nSometimes when I create a new file using "New page", it goes to no-man\'s land. The file does not show up under either of the wikis I\'ve created even after a refresh. But they are viewable if I click the "Fulcrum wiki" logo in the top left. \r\n\r\nBehaviour 1\r\n1. Click Fulcrum wiki logo\r\n2. Click "new page"\r\n3. Type in title and save\r\nFile now lives under "My fulcrum"  (why that one and not my second wiki, "Drive wiki?")\r\n\r\nBehaviour 2\r\n1. Click "my fulcrum" (it gets highlighted in blue and I get taken to the "Welcome to your wiki" page)\r\n2. Click "new page"\r\n3. type in title and save\r\nFile does NOT live under "My fulcrum"\r\nFile lives on the page when I click the "Fulcrum Wiki" logo.\r\n\r\nExpected behaviour:\r\n- Expected behaviour for 1: Ask which wiki it should go to\r\n- Expected behaviour for 2: Create it under the highlighted wiki\r\n- Alternative solution: get rid of the "new page" button.\r\n- Alternative solution: make it easy to drag pages between wikis',
    id: 'github-rockiger-junto-117',
    edited: '2020-02-20T00:44:30.000Z',
    status: TaskState.Done,
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    project: 'github-rockiger-junto',
    title: 'Bug: New pages are not shown in sidebar.',
    finished: '2020-02-20T00:44:30.000Z',
  },
];

describe('correctPositionInBoard', () => {
  it("should doesn't change anything, if all is correct", () => {
    expect(correctPositionsInBoard(board, tasks)).toEqual(board);
  });

  it('should move the to the Done column, if task is Done', () => {
    const newTasks = produce(tasks, draftTasks => {
      draftTasks[7].status = TaskState.Done;
    });
    const newBoard = produce(board, draftBoard => {
      const removedTasks = draftBoard.columns[2].taskIds.splice(1, 1);
      draftBoard.columns[3].taskIds.push(...removedTasks);
    });
    expect(correctPositionsInBoard(board, newTasks)).toEqual(newBoard);
  });

  it('should move the to the Backlog column, if task is Backlog', () => {
    const newTasks = produce(tasks, draftTasks => {
      draftTasks[11].status = TaskState.Backlog;
    });
    const newBoard = produce(board, draftBoard => {
      const removedTasks = draftBoard.columns[3].taskIds.splice(2, 1);
      draftBoard.columns[0].taskIds.push(...removedTasks);
    });
    expect(correctPositionsInBoard(board, newTasks)).toEqual(newBoard);
  });

  it('should move the to the Todo column, if task is Todo', () => {
    const newTasks = produce(tasks, draftTasks => {
      draftTasks[11].status = TaskState.Todo;
    });
    const newBoard = produce(board, draftBoard => {
      const removedTasks = draftBoard.columns[3].taskIds.splice(2, 1);
      draftBoard.columns[1].taskIds.push(...removedTasks);
    });
    expect(correctPositionsInBoard(board, newTasks)).toEqual(newBoard);
  });

  it('should move the to the Doing column, if task is Doing', () => {
    const newTasks = produce(tasks, draftTasks => {
      draftTasks[11].status = TaskState.Doing;
    });
    const newBoard = produce(board, draftBoard => {
      const removedTasks = draftBoard.columns[3].taskIds.splice(2, 1);
      draftBoard.columns[2].taskIds.push(...removedTasks);
    });
    expect(correctPositionsInBoard(board, newTasks)).toEqual(newBoard);
  });
});

describe('correctPositionInBoardHelper', () => {
  it("should doesn't change anything, if all is correct", () => {
    expect(correctPositionsInBoardHelper(board, tasks[7])).toEqual({
      columns: board.columns,
      needsUpdate: false,
    });
  });
});

const tasksMap: TaskMap = {
  'github-rockiger-junto-133': {
    status: TaskState.Backlog,
    created: '2020-04-16T22:43:08.000Z',
    finished: '',
    title: 'Refactor Login with react-google-login',
    project: 'github-rockiger-junto',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    id: 'github-rockiger-junto-133',
    description: 'https://www.npmjs.com/package/react-google-login',
    edited: '2020-04-16T22:43:08.000Z',
  },

  'github-rockiger-junto-136': {
    project: 'github-rockiger-junto',
    status: TaskState.Backlog,
    edited: '2020-05-22T07:18:29.000Z',
    title: 'Show current directory in Header',
    description:
      'As a user I want to see, I which directory I am in the moment. ',
    created: '2020-05-22T07:18:29.000Z',
    id: 'github-rockiger-junto-136',
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
  },
  'github-rockiger-junto-109': {
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-02-03T21:16:43.000Z',
    project: 'github-rockiger-junto',
    description: '',
    id: 'github-rockiger-junto-109',
    edited: '2020-02-03T21:16:43.000Z',
    status: TaskState.Backlog,
    title: 'Test TestingCafe, maybe it works better with Google Drive',
  },
  'github-rockiger-junto-135': {
    project: 'github-rockiger-junto',
    title: 'Bookmarking Pages',
    edited: '2020-05-22T07:17:21.000Z',
    created: '2020-05-22T07:17:21.000Z',
    status: TaskState.Todo,
    id: 'github-rockiger-junto-135',
    finished: '',
    description:
      'As a user, I want to bookmark pages. To have a list of especially interesting pages.',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
  },
  'github-rockiger-junto-140': {
    description:
      'Ben want to tag his wiki pages, that he can group them logically.',
    title: 'Tagging',
    id: 'github-rockiger-junto-140',
    project: 'github-rockiger-junto',
    edited: '2020-06-12T17:41:44.000Z',
    created: '2020-06-12T17:41:44.000Z',
    status: TaskState.Todo,
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    finished: '',
  },
  'github-rockiger-junto-141': {
    description: '',
    status: TaskState.Todo,
    edited: '2020-06-12T19:43:37.000Z',
    created: '2020-06-12T19:43:37.000Z',
    project: 'github-rockiger-junto',
    title: 'Rework the onboarding like other GSuite extensions',
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    id: 'github-rockiger-junto-141',
  },
  'github-rockiger-junto-147': {
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-07-23T07:20:13.000Z',
    edited: '2020-07-23T07:20:13.000Z',
    id: 'github-rockiger-junto-147',
    finished: '',
    title:
      'Problems with image pasting. Content is duplicated when pasted image is present in Text',
    project: 'github-rockiger-junto',
    status: TaskState.Doing,
    description: '',
  },
  'github-rockiger-junto-10': {
    id: 'github-rockiger-junto-10',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    edited: '2020-02-09T23:41:04.000Z',
    title:
      'Refactor search and filelist with search term in url. That the user can use the browser back and forward button and make searches linkable.',
    created: '2020-02-09T23:41:04.000Z',
    project: 'github-rockiger-junto',
    finished: '',
    status: TaskState.Doing,
    description: '',
  },
  'github-rockiger-junto-113': {
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    project: 'github-rockiger-junto',
    id: 'github-rockiger-junto-113',
    title: 'Move pages',
    created: '2020-02-07T02:05:42.000Z',
    status: TaskState.Doing,
    description: '',
    edited: '2020-05-08T09:07:18.000Z',
  },
  'github-rockiger-junto-142': {
    project: 'github-rockiger-junto',
    id: 'github-rockiger-junto-142',
    status: TaskState.Done,
    description: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    finished: '',
    title:
      'Write test for getFolderId in SidebarTree-helper, to find the problem why it shows pages without childs as subfolders. ',
    created: '2020-06-22T21:06:35.000Z',
    edited: '2020-06-22T21:06:35.000Z',
  },
  'github-rockiger-junto-131': {
    edited: '2020-03-19T23:15:05.000Z',
    project: 'github-rockiger-junto',
    title: "When I add a new page it doesn't has a parent.",
    id: 'github-rockiger-junto-131',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    status: TaskState.Done,
    description: '',
    finished: '',
    created: '2020-03-16T21:32:42.000Z',
  },
  'github-rockiger-junto-117': {
    created: '2020-02-17T22:17:51.000Z',
    description:
      '\r\n![image](https://user-images.githubusercontent.com/458677/82642361-0ecccf00-9c0e-11ea-8a5f-c3a4ebc2ab79.png)\r\nSometimes when I create a new file using "New page", it goes to no-man\'s land. The file does not show up under either of the wikis I\'ve created even after a refresh. But they are viewable if I click the "Fulcrum wiki" logo in the top left. \r\n\r\nBehaviour 1\r\n1. Click Fulcrum wiki logo\r\n2. Click "new page"\r\n3. Type in title and save\r\nFile now lives under "My fulcrum"  (why that one and not my second wiki, "Drive wiki?")\r\n\r\nBehaviour 2\r\n1. Click "my fulcrum" (it gets highlighted in blue and I get taken to the "Welcome to your wiki" page)\r\n2. Click "new page"\r\n3. type in title and save\r\nFile does NOT live under "My fulcrum"\r\nFile lives on the page when I click the "Fulcrum Wiki" logo.\r\n\r\nExpected behaviour:\r\n- Expected behaviour for 1: Ask which wiki it should go to\r\n- Expected behaviour for 2: Create it under the highlighted wiki\r\n- Alternative solution: get rid of the "new page" button.\r\n- Alternative solution: make it easy to drag pages between wikis',
    id: 'github-rockiger-junto-117',
    edited: '2020-02-20T00:44:30.000Z',
    status: TaskState.Done,
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    project: 'github-rockiger-junto',
    title: 'Bug: New pages are not shown in sidebar.',
    finished: '2020-02-20T00:44:30.000Z',
  },
};
