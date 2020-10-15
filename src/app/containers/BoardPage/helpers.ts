import * as githubConnector from '../Database/connectors/github';
import * as googletasksConnector from '../Database/connectors/googletasks';
import { db } from '../Database/firebase';
import { Board, Task } from '../Database/types';

export async function syncBoardFromProviders(
  board,
  setBoard,
  tasks,
  uid: string,
) {
  const projectIds = board.projects;

  try {
    for (const projectId of projectIds) {
      const [, projectType] = projectId.split('-');
      if (projectType === 'github') {
        //! get githubtoken
        const profileRef = db.collection('users').doc(uid);
        const profileSnapshot = await profileRef.get();
        const profile = profileSnapshot.data();
        await githubConnector.sync(
          db,
          tasks,
          projectId,
          uid,
          profile?.githubToken,
        );
      }
      if (projectType === 'googletasks') {
        await googletasksConnector.sync(db, tasks, projectId, uid);
      }

      // correctPositionInBoard
      // get tasks of this board
      let updatedTasks: any[] = [];
      const updatedTasksRef = db
        .collection('tasks')
        // projectIds can't be longer then 10, otherwise firestore
        // throws an error. If more projects are needed. This call needs
        // to be rewritten.
        .where('project', 'in', projectIds)
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
        return { ...column, taskIds: [...column.taskIds, task.id] };
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
