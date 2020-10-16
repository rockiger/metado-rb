import { call as effCall } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

import { reduxSagaFirebase as rsf, db } from '../firebase';
import { addGithubProject, call } from '../saga.ts.bak';
import { actions } from '../slice';

// const call: any = effCall;
describe('AddGithubProject', () => {
  const action = {
    payload: {
      activeBoard: 'main-board',
      repo: {
        full_name: 'rockiger/akiee',
        name: 'akiee',
        owner: { login: 'rockiger' },
      },
    },
  };
  //! Write test that does something
  it('should abort if board.projects.length is 10 or more', () => {
    const boardRef = { get: () => ({ data: () => ({}) }) };
    const projectsRef = { set: () => ({ data: () => ({}) }) };
    return (
      expectSaga(addGithubProject, action)
        .withState({ database: { authUser: { uid: '123456' } } })
        .provide([
          [call([projectsRef, projectsRef.set]), {}],
          [
            call([boardRef, boardRef.get]),
            { projects: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
          ],
          [call([boardRef, boardRef.get]), {}],
        ])
        //.put.like({ action: { type: actions.addGithubProjectError.type } })
        .run()
        .then(result => console.dir(result))
    );
  });
});
