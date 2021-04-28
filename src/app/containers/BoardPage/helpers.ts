import * as githubConnector from '../Database/connectors/github';
import * as googletasksConnector from '../Database/connectors/googletasks';
import * as trelloConnector from '../Database/connectors/trello';
import { db } from '../Database/firebase';
import { Board, ProjectMap, Task, TaskMap } from '../Database/types';

export async function syncBoardFromProviders(
  board: Board,
  projects: ProjectMap,
  setBoard: (p: any) => void,
  tasks: TaskMap,
  uid: string,
) {
  try {
    for (const project of Object.values(projects)) {
      if (project.type === 'github') {
        //! get githubtoken
        const profileRef = db.collection('users').doc(uid);
        const profileSnapshot = await profileRef.get();
        const profile = profileSnapshot.data();
        await githubConnector.sync(
          db,
          tasks,
          project,
          uid,
          profile?.githubToken,
        );
      }
      if (project.type === 'googletasks') {
        await googletasksConnector.sync(db, tasks, project.id, uid);
      }
      if (project.type === 'trello') {
        //! get trelloToken
        const profileRef = db.collection('users').doc(uid);
        const profileSnapshot = await profileRef.get();
        const profile = profileSnapshot.data();
        await trelloConnector.sync(
          db,
          tasks,
          project,
          uid,
          profile?.trelloToken,
        );
      }
      // correctPositionInBoard
      // get tasks of this board
      let updatedTasks: any[] = [];
      const updatedTasksRef = db
        .collection('tasks')
        // board.projects can't be longer then 10, otherwise firestore
        // throws an error. If more projects are needed. This call needs
        // to be rewritten.
        .where('project', 'in', board.projects)
        .where('user', '==', uid);
      const updatedTaskQuery = await updatedTasksRef.get();
      updatedTaskQuery.forEach(
        doc => doc.data && updatedTasks.push(doc.data()),
      );
      const updatedBoard = correctPositionsInBoard(board, updatedTasks);
      setBoard(updatedBoard);

      const saveBoardRef = db
        .collection('users')
        .doc(uid)
        .collection('boards')
        .doc(updatedBoard.id);
      await saveBoardRef.set(updatedBoard);
    }
  } catch (error) {
    console.error(error);
  }
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
        return { ...column, taskIds: [task.id, ...column.taskIds] };
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
