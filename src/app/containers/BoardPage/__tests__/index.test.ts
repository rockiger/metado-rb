import { DropResult } from 'react-beautiful-dnd';
import produce from 'immer';

import { actions as databaseActions } from 'app/containers/Database/slice';
import { Board, TaskMap, TaskState } from 'app/containers/Database/types';

import { onDragEndResult } from '../index';

describe('onDragEndResult', () => {
  const baseDropResult: DropResult = {
    draggableId: 'github-rockiger-junto-140',
    type: 'DEFAULT',
    source: {
      index: 1,
      droppableId: '1',
    },
    reason: 'DROP',
    mode: 'FLUID',
    destination: {
      droppableId: '2',
      index: 1,
    },
  };

  it('should return an empty array with the DropResult has no destination', () => {
    const result: DropResult = produce(baseDropResult, draftResult => {
      draftResult.destination = undefined;
    });

    expect(onDragEndResult(result, board, ownerId, tasks)).toEqual([]);
  });

  it('should return an empty array if the source and the destination are the same', () => {
    const result: DropResult = produce(baseDropResult, draftResult => {
      draftResult.destination = {
        index: 1,
        droppableId: '1',
      };
    });

    expect(onDragEndResult(result, board, ownerId, tasks)).toEqual([]);
  });

  it('should return a single entry array if the source and the destination droppableIds are the same but the indexes are', () => {
    const result: DropResult = produce(baseDropResult, draftResult => {
      draftResult.destination = {
        index: 2,
        droppableId: '1',
      };
    });

    const newBoard = produce(board, draftBoard => {
      draftBoard.columns![1].taskIds = [
        'github-rockiger-junto-135',
        'github-rockiger-junto-141',
        'github-rockiger-junto-140',
      ];
    });

    expect(onDragEndResult(result, board, ownerId, tasks)).toEqual([
      databaseActions.updateBoard({ board: newBoard, uid: ownerId }),
    ]);
  });
  it('should return a two entrys array if the source and the destination droppableIds are the same but the indexes are', () => {
    const result: DropResult = produce(baseDropResult, draftResult => {});

    const newBoard = produce(board, draftBoard => {
      draftBoard.columns![1].taskIds = [
        'github-rockiger-junto-135',
        'github-rockiger-junto-141',
      ];
      draftBoard.columns![2].taskIds = [
        'github-rockiger-junto-147',
        'github-rockiger-junto-140',
        'github-rockiger-metado-10',
        'github-rockiger-junto-113',
      ];
    });

    const newTask = produce(tasks[result.draggableId], draftTask => {
      draftTask.status = TaskState.Doing;
    });

    expect(onDragEndResult(result, board, ownerId, tasks)).toEqual([
      databaseActions.updateBoard({ board: newBoard, uid: ownerId }),
      databaseActions.updateTask({
        oldTask: tasks[result.draggableId],
        task: newTask,
      }),
    ]);
  });
});

const ownerId = 'WYnJgw3T3yZyfr8LqdxESP87Sox2';

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

const tasks: TaskMap = {
  'github-rockiger-junto-105': {
    edited: '2020-02-03T21:48:20.000Z',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-01-27T12:26:17.000Z',
    project: 'github-rockiger-junto',
    description: '',
    finished: '2020-02-03T21:48:20.000Z',
    id: 'github-rockiger-junto-105',
    title:
      'Saving seems to be very slow right now. When saving with Shortcut. It seems we are waiting for something.',
    status: TaskState.Done,
  },
  'github-rockiger-junto-106': {
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    project: 'github-rockiger-junto',
    title: 'Bug: Ignore save shortcut in code element',
    finished: '2020-02-04T02:23:39.000Z',
    created: '2020-01-27T12:27:57.000Z',
    description: '',
    edited: '2020-02-04T02:23:39.000Z',
    status: TaskState.Done,
    id: 'github-rockiger-junto-106',
  },
  'github-rockiger-junto-107': {
    edited: '2020-02-03T22:43:37.000Z',
    title: 'Bewertung im Marketplace',
    id: 'github-rockiger-junto-107',
    status: TaskState.Done,
    finished: '2020-02-03T22:43:36.000Z',
    project: 'github-rockiger-junto',
    created: '2020-02-03T21:12:16.000Z',
    description: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
  },
  'github-rockiger-junto-108': {
    project: 'github-rockiger-junto',
    created: '2020-02-03T21:13:30.000Z',
    title: 'Milestone in IndieHackers',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    description: '',
    id: 'github-rockiger-junto-108',
    edited: '2020-02-07T02:04:39.000Z',
    status: TaskState.Done,
    finished: '2020-02-07T02:04:38.000Z',
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
  'github-rockiger-junto-110': {
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    status: TaskState.Backlog,
    project: 'github-rockiger-junto',
    id: 'github-rockiger-junto-110',
    created: '2020-02-05T23:15:46.000Z',
    edited: '2020-02-05T23:15:46.000Z',
    finished: '',
    description: '',
    title:
      'As PO I want to improve analytics to learn more about user behavior, that I can do better decision for product features.',
  },
  'github-rockiger-junto-111': {
    edited: '2020-02-05T23:16:19.000Z',
    id: 'github-rockiger-junto-111',
    status: TaskState.Backlog,
    created: '2020-02-05T23:16:19.000Z',
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    description: '',
    project: 'github-rockiger-junto',
    title: 'Add a blog for content marketing',
  },
  'github-rockiger-junto-112': {
    title: 'Create a seo strategy',
    edited: '2020-02-06T17:43:37.000Z',
    status: TaskState.Backlog,
    finished: '',
    project: 'github-rockiger-junto',
    id: 'github-rockiger-junto-112',
    description: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-02-06T17:43:37.000Z',
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
  'github-rockiger-junto-114': {
    title: 'Close pages',
    project: 'github-rockiger-junto',
    edited: '2020-02-07T02:05:57.000Z',
    finished: '',
    description: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    status: TaskState.Backlog,
    created: '2020-02-07T02:05:57.000Z',
    id: 'github-rockiger-junto-114',
  },
  'github-rockiger-junto-115': {
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    id: 'github-rockiger-junto-115',
    description: '',
    status: TaskState.Backlog,
    title: 'Undelete Pages',
    edited: '2020-02-07T02:06:19.000Z',
    finished: '',
    project: 'github-rockiger-junto',
    created: '2020-02-07T02:06:19.000Z',
  },
  'github-rockiger-junto-116': {
    id: 'github-rockiger-junto-116',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    edited: '2020-02-09T23:41:04.000Z',
    title:
      'Refactor search and filelist with search term in url. That the user can use the browser back and forward button and make searches linkable.',
    created: '2020-02-09T23:41:04.000Z',
    project: 'github-rockiger-junto',
    finished: '',
    status: TaskState.Backlog,
    description: '',
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
  'github-rockiger-junto-118': {
    status: TaskState.Backlog,
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    description: '',
    project: 'github-rockiger-junto',
    created: '2020-02-20T00:56:24.000Z',
    title:
      'Mail-Liste mit bekannten zusammenstellen, die ich anschreiben kann und für die Fulcrum interessant sein könnte.',
    id: 'github-rockiger-junto-118',
    edited: '2020-02-20T00:57:01.000Z',
  },
  'github-rockiger-junto-119': {
    edited: '2020-02-20T01:06:09.000Z',
    created: '2020-02-20T01:06:09.000Z',
    status: TaskState.Backlog,
    project: 'github-rockiger-junto',
    description: '',
    id: 'github-rockiger-junto-119',
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    title:
      'Add "No recent items match your search" to recentlist, if it ist empty.',
  },
  'github-rockiger-junto-120': {
    edited: '2020-02-26T15:29:46.000Z',
    project: 'github-rockiger-junto',
    title: 'Darstellung auf mobilen Geräten gerade ziehen.',
    description: '',
    status: TaskState.Done,
    id: 'github-rockiger-junto-120',
    created: '2020-02-20T10:20:31.000Z',
    finished: '2020-02-26T15:29:46.000Z',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
  },
  'github-rockiger-junto-121': {
    status: TaskState.Backlog,
    finished: '',
    description: '',
    project: 'github-rockiger-junto',
    edited: '2020-02-20T10:21:12.000Z',
    created: '2020-02-20T10:21:12.000Z',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    id: 'github-rockiger-junto-121',
    title: 'Staging system aufbauen',
  },
  'github-rockiger-junto-122': {
    project: 'github-rockiger-junto',
    finished: '',
    title: 'Integrationtests neu schreiben',
    status: TaskState.Backlog,
    id: 'github-rockiger-junto-122',
    created: '2020-02-20T10:21:51.000Z',
    edited: '2020-02-20T10:21:51.000Z',
    description: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
  },
  'github-rockiger-junto-123': {
    created: '2020-02-22T11:19:12.000Z',
    status: TaskState.Done,
    title: 'Reddit Nutzer rückfragen',
    project: 'github-rockiger-junto',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    finished: '2020-03-02T21:10:52.000Z',
    description: '',
    edited: '2020-03-02T21:10:52.000Z',
    id: 'github-rockiger-junto-123',
  },
  'github-rockiger-junto-124': {
    project: 'github-rockiger-junto',
    id: 'github-rockiger-junto-124',
    status: TaskState.Backlog,
    title:
      'Add App Menu to other Google Apps, to integrate even more with gsuite',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    description: '',
    edited: '2020-02-22T11:53:52.000Z',
    created: '2020-02-22T11:53:52.000Z',
    finished: '',
  },
  'github-rockiger-junto-125': {
    status: TaskState.Done,
    edited: '2020-02-26T15:38:24.000Z',
    created: '2020-02-26T15:38:24.000Z',
    id: 'github-rockiger-junto-125',
    title: 'Archive a Page/Wiki',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    finished: '',
    project: 'github-rockiger-junto',
    description:
      'As a user I want to remove a page, to get it out of my way if its information is obsolete.\n\n- [x] Flag Page is archive true\n- [x] if (hasChilds) move them to parent\n~~- [ ] show feature on my fulcrum as inactive~~\n- [x] archive on wikiRoot will archive all pages (unArchive will only work whole wiki)\n~~- [ ] show warning only once per user and browser~~',
  },
  'github-rockiger-junto-126': {
    title: 'Create an Audit trail save events like first using the app',
    description: '',
    created: '2020-02-26T15:41:20.000Z',
    status: TaskState.Done,
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    id: 'github-rockiger-junto-126',
    edited: '2020-04-18T21:59:37.000Z',
    project: 'github-rockiger-junto',
    finished: '2020-04-18T21:59:37.000Z',
  },
  'github-rockiger-junto-127': {
    description: '',
    title:
      "/ still opens the search, but doesn't focus the search field for typing.",
    created: '2020-02-27T07:25:28.000Z',
    finished: '2020-03-01T22:01:55.000Z',
    project: 'github-rockiger-junto',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    status: TaskState.Done,
    edited: '2020-03-01T22:01:55.000Z',
    id: 'github-rockiger-junto-127',
  },
  'github-rockiger-junto-128': {
    status: TaskState.Done,
    edited: '2020-03-05T23:20:24.000Z',
    title:
      "Deletion of Wiki's doesn't. The folder is shown even if it is deleted.",
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-03-05T22:04:53.000Z',
    description: '',
    finished: '2020-03-05T23:20:24.000Z',
    project: 'github-rockiger-junto',
    id: 'github-rockiger-junto-128',
  },
  'github-rockiger-junto-129': {
    edited: '2020-03-05T23:20:38.000Z',
    project: 'github-rockiger-junto',
    title: "Sharing doesn't show right now.",
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    id: 'github-rockiger-junto-129',
    description: '',
    status: TaskState.Done,
    finished: '2020-03-05T23:20:38.000Z',
    created: '2020-03-05T22:15:54.000Z',
  },
  'github-rockiger-junto-130': {
    status: TaskState.Done,
    title: 'Plusses are not shown in life site',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-03-16T21:31:55.000Z',
    id: 'github-rockiger-junto-130',
    edited: '2020-03-18T15:09:04.000Z',
    description: '',
    project: 'github-rockiger-junto',
    finished: '2020-03-18T15:09:04.000Z',
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
  'github-rockiger-junto-132': {
    edited: '2020-03-25T20:14:47.000Z',
    description:
      "- [ ] get wider permissions, that people can share their wiki's.\n- [ ] think about what you need to change to make fulcrum still work\n- [ ] think about upgrade path\n- [ ] explain users when they need to give use that permissions",
    created: '2020-03-25T20:14:47.000Z',
    finished: '',
    title:
      "As a organization I want to establish shared wiki's on a shared drive, that my employees can share their knowledge.",
    project: 'github-rockiger-junto',
    status: TaskState.Backlog,
    id: 'github-rockiger-junto-132',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
  },
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
  'github-rockiger-junto-134': {
    status: TaskState.Done,
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    edited: '2020-05-08T09:04:33.000Z',
    title: 'Build help section / FAQ',
    finished: '',
    created: '2020-05-08T09:04:33.000Z',
    project: 'github-rockiger-junto',
    description:
      "As a new user I want to have some help when I am starting to use the app, that I don't get frustrated.",
    id: 'github-rockiger-junto-134',
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
  'github-rockiger-junto-137': {
    title: 'Rename wikis',
    finished: '',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    edited: '2020-06-06T08:58:09.000Z',
    id: 'github-rockiger-junto-137',
    created: '2020-06-06T08:58:09.000Z',
    description:
      'As a user I want to rename whole wikis, that I can name it in a way I want and change their name, if their content changes.',
    project: 'github-rockiger-junto',
    status: TaskState.Backlog,
  },
  'github-rockiger-junto-138': {
    created: '2020-06-12T17:08:30.000Z',
    status: TaskState.Done,
    project: 'github-rockiger-junto',
    edited: '2020-06-12T17:08:30.000Z',
    id: 'github-rockiger-junto-138',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    description:
      'Ben wants an overview page with all his wikis, that he can see remember all the wikis of all the different customers he is working with.\n\n- [ ] Overviewpage\n- [ ] Show wiki name, wiki description\n- [ ] Show if it is a shared wiki \n- [ ] if possible show Shared drive name\n- [ ] if possible show owner of wiki/drive',
    title: 'Wiki Overview',
    finished: '',
  },
  'github-rockiger-junto-139': {
    id: 'github-rockiger-junto-139',
    description:
      "Ben wants a possibility to add tasks to Google Task or a central Task-Management that he don't miss tasks and has them all in one place.",
    edited: '2020-06-12T17:37:43.000Z',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-06-12T17:37:43.000Z',
    finished: '',
    project: 'github-rockiger-junto',
    title: 'Possibility to add tasks from Fulcrum to Google Task',
    status: TaskState.Backlog,
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
  'github-rockiger-junto-143': {
    title:
      'As a user I want to distiguage which pages and which wikis have been archived, to get a better feeling where I need to look, if I am trying to find something old.',
    finished: '',
    created: '2020-06-22T21:09:25.000Z',
    status: TaskState.Done,
    project: 'github-rockiger-junto',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    id: 'github-rockiger-junto-143',
    edited: '2020-06-22T21:09:25.000Z',
    description: '',
  },
  'github-rockiger-junto-144': {
    finished: '',
    project: 'github-rockiger-junto',
    edited: '2020-06-25T07:36:09.000Z',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    title:
      'As a user I want to get notified about new features, that I use them to my advantage.',
    created: '2020-06-25T07:36:09.000Z',
    description: '',
    id: 'github-rockiger-junto-144',
    status: TaskState.Backlog,
  },
  'github-rockiger-junto-145': {
    project: 'github-rockiger-junto',
    title: 'Tour for new users.',
    created: '2020-06-25T07:36:55.000Z',
    id: 'github-rockiger-junto-145',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    finished: '',
    edited: '2020-06-25T07:36:55.000Z',
    status: TaskState.Backlog,
    description: '',
  },
  'github-rockiger-junto-146': {
    edited: '2020-06-28T12:12:11.000Z',
    created: '2020-06-28T12:12:11.000Z',
    title: 'Persist uiState',
    description: 'useReact hook for persisting states.',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    finished: '',
    id: 'github-rockiger-junto-146',
    status: TaskState.Doing,
    project: 'github-rockiger-junto',
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
  'github-rockiger-metado-1': {
    status: TaskState.Done,
    id: 'github-rockiger-metado-1',
    description:
      "acc:\r\n\r\n- [ ] auth with github\r\n- [ ] save/update user's access token\r\n- [ ] let user select project",
    finished: '2020-04-27T22:13:31.000Z',
    edited: '2020-04-27T22:13:31.000Z',
    title:
      'As a user I want to add a github project that I can see what tasks I have to do.',
    created: '2020-04-25T23:23:54.000Z',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    project: 'github-rockiger-metado',
  },
  'github-rockiger-metado-10': {
    description: '',
    status: TaskState.Doing,
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-05-03T14:49:49.000Z',
    finished: '',
    title:
      'As a github user I want my task remove if the corresponding issue is deleted.',
    edited: '2020-05-03T14:49:49.000Z',
    id: 'github-rockiger-metado-10',
    project: 'github-rockiger-metado',
  },
  'github-rockiger-metado-2': {
    finished: '2020-04-27T20:47:18.000Z',
    created: '2020-04-26T20:39:14.000Z',
    project: 'github-rockiger-metado',
    status: TaskState.Done,
    title: 'Connect to github',
    edited: '2020-04-27T20:47:18.000Z',
    description: '',
    id: 'github-rockiger-metado-2',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
  },
  'github-rockiger-metado-3': {
    title: 'Sync tasks',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-04-26T22:27:27.000Z',
    finished: '2020-04-27T22:13:25.000Z',
    project: 'github-rockiger-metado',
    description: '',
    status: TaskState.Done,
    id: 'github-rockiger-metado-3',
    edited: '2020-04-27T22:13:25.000Z',
  },
  'github-rockiger-metado-4': {
    id: 'github-rockiger-metado-4',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    project: 'github-rockiger-metado',
    created: '2020-04-27T22:15:25.000Z',
    status: TaskState.Done,
    finished: '',
    description: '',
    title:
      'As a github user I to change the tasks status to make a kanban/scrum workflow possible.',
    edited: '2020-04-27T22:15:25.000Z',
  },
  'github-rockiger-metado-5': {
    edited: '2020-05-03T14:51:13.000Z',
    project: 'github-rockiger-metado',
    status: TaskState.Done,
    id: 'github-rockiger-metado-5',
    description:
      '- [x] Make the cards move\r\n- [x] Speed up the rewrite of the task with caching the result in the before sending it to firebase\r\n- [x] Refactor the code ',
    created: '2020-04-27T22:16:12.000Z',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    title:
      'As a github user I want to order my task to determine what to do next.',
    finished: '2020-05-03T14:51:13.000Z',
  },
  'github-rockiger-metado-6': {
    description: '',
    id: 'github-rockiger-metado-6',
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    finished: '2020-05-03T13:46:45.000Z',
    edited: '2020-05-03T13:46:45.000Z',
    project: 'github-rockiger-metado',
    title:
      'As a github user I want to order my task to determine what to do next.',
    created: '2020-04-27T22:16:17.000Z',
    status: TaskState.Done,
  },
  'github-rockiger-metado-7': {
    edited: '2020-04-27T22:19:27.000Z',
    title:
      "As a github user I want to add new task via metado, that I don't have to switch to github to add an issue.",
    project: 'github-rockiger-metado',
    id: 'github-rockiger-metado-7',
    created: '2020-04-27T22:19:27.000Z',
    finished: '',
    description: 'Acc:\r\n\r\n- Adding a task, also adds the issue to github.',
    status: TaskState.Doing,
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
  },
  'github-rockiger-metado-8': {
    edited: '2020-05-04T10:09:43.000Z',
    finished: '',
    project: 'github-rockiger-metado',
    description: '',
    status: TaskState.Done,
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    created: '2020-05-03T13:48:16.000Z',
    title: 'Write test for thunk logic and switch to TS',
    id: 'github-rockiger-metado-8',
  },
  'github-rockiger-metado-9': {
    user: 'WYnJgw3T3yZyfr8LqdxESP87Sox2',
    status: TaskState.Done,
    project: 'github-rockiger-metado',
    description: '',
    created: '2020-05-03T14:44:04.000Z',
    title:
      'As a github user I want my issues closed when I am change my task to Done.',
    finished: '',
    id: 'github-rockiger-metado-9',
    edited: '2020-05-03T14:49:01.000Z',
  },
};
