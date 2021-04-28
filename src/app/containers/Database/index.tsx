/**
 *
 * Database
 *
 */
import * as _ from 'lodash';

import { db } from './firebase';
import { Board, ProjectMap } from './types';
import { firestore } from 'firebase';

export * from './firebase';

export async function connectBoard(
  ownerId: string,
  boardId: string,
  onSnapshotFn: (doc) => void,
) {
  const boardRef = db
    .collection('users')
    .doc(ownerId)
    .collection('boards')
    .doc(boardId);
  const boardSnapshot = (await boardRef.get()) as firestore.QueryDocumentSnapshot<
    Board
  >;
  const boardData = boardSnapshot.data();
  const boardListener = boardRef.onSnapshot(doc =>
    onSnapshotFn(doc.data() as Board),
  );
  return { boardListener, boardData };
}

export async function getProjectsById(projectIds: string[]) {
  if (_.isEmpty(projectIds)) return {};

  // get projects
  const projectsRef = db.collection('projects').where('id', 'in', projectIds);
  const projectsSnapshot = await projectsRef.get();
  let projectsData: ProjectMap = {};
  projectsSnapshot.forEach(doc => {
    const {
      created,
      fullname,
      id,
      listAssignments,
      name,
      owner,
      trelloBoardId,
      type,
      user,
    } = doc.data();
    projectsData[doc.id] = {
      created,
      fullname,
      id,
      listAssignments,
      name,
      owner,
      trelloBoardId,
      type,
      user,
    };
  });
  return projectsData;
}
