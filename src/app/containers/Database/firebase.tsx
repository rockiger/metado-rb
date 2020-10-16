import React, { createContext, useEffect, useContext, useState } from 'react';
import firebase, { User } from 'firebase';
import '@firebase/firestore'; // 👈 If you're using firestore

type Status = 'init' | 'user' | 'profile';

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

export const authProvider = new firebase.auth.GithubAuthProvider();
export const firebaseAuth = firebase.auth();
export const db = myFirebaseApp.firestore();

export const AuthContext = createContext<{
  user: User | null;
  profile: Dict | null | undefined;
  error: any;
  status: Status;
}>({ user: null, profile: null, status: 'init', error: null });

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => firebase.auth().currentUser);
  const [profile, setProfile] = useState<Dict | null | undefined>(null);

  const [status, setStatus] = useState<Status>('init');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<any>(null);

  React.useEffect(() => {
    // listen for auth state changes
    const unsubscribe = firebase.auth().onAuthStateChanged(onChangeUser);
    // unsubscribe to the listener when unmounting
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const profileRef = db.collection('users').doc(user.uid);
      const unsubscribe = profileRef.onSnapshot(doc => {
        setProfile(doc.data());
        setStatus('profile');
      });
      return () => unsubscribe();
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, profile, status, error }}>
      {children}
    </AuthContext.Provider>
  );

  function onChangeUser(user) {
    setUser(user);
    if (user) setStatus('user');
  }
}
