import firebase from 'firebase';
import '@firebase/firestore'; // 👈 If you're using firestore
import ReduxSagaFirebase from 'redux-saga-firebase';

const myFirebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDijpCw3wqXRZa8zXN9j8rRq_RFQu1ED_g',
  authDomain: 'metado-f91ea.firebaseapp.com',
  databaseURL: 'https://metado-f91ea.firebaseio.com',
  projectId: 'metado-f91ea',
  storageBucket: 'metado-f91ea.appspot.com',
  messagingSenderId: '933456903215',
  appId: '1:933456903215:web:f7e6579a17585cbff39ada',
  measurementId: 'G-0W9C3L7Z2B',
});

const reduxSagaFirebase = new ReduxSagaFirebase(myFirebaseApp);
const authProvider = new firebase.auth.GithubAuthProvider();
const fireStore = myFirebaseApp.firestore();

export { reduxSagaFirebase, authProvider, fireStore };
