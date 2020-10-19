import React, { createContext, useEffect, useContext, useState } from 'react';
import * as firebase from 'firebase/app';
import { User } from 'firebase';
import '@firebase/firestore'; // 👈 If you're using firestore
import '@firebase/auth';

type Status = 'init' | 'user' | 'profile';

const myFirebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDijpCw3wqXRZa8zXN9j8rRq_RFQu1ED_g',
  authDomain: 'metado-f91ea.firebaseapp.com',
  databaseURL: 'https://metado.app',
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
  const [user, setUser] = useState(getLocalAuthUser);
  const [profile, setProfile] = useState<Dict | null | undefined>(
    getLocalAuthProfile,
  );

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
    if (user?.uid) {
      console.log({ user });
      const profileRef = db.collection('users').doc(user.uid);
      const unsubscribe = profileRef.onSnapshot(doc => {
        setProfile(doc.data());
        setLocalAuthProfile(doc.data());
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
    setLocalAuthUser(user);
    if (user) setStatus('user');
  }
}

function getLocalAuthUser() {
  const authStorageJson = localStorage.getItem('authUser');
  const authStorage = authStorageJson ? JSON.parse(authStorageJson) : {};
  if (isAuthUser(authStorage)) return authStorage;
  return null;
}

function isAuthUser(obj: any): obj is firebase.User {
  return typeof obj === 'object';
}

function setLocalAuthUser(authUser) {
  localStorage.setItem('authUser', JSON.stringify(authUser));
}

function getLocalAuthProfile() {
  const authStorageJson = localStorage.getItem('authProfile');
  const authStorage = authStorageJson ? JSON.parse(authStorageJson) : {};
  if (isAuthProfile(authStorage)) return authStorage;
  return null;
}

function isAuthProfile(obj: any): obj is Dict {
  return typeof obj === 'object';
}

function setLocalAuthProfile(authProfile) {
  localStorage.setItem('authProfile', JSON.stringify(authProfile));
}
