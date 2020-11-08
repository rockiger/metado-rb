import React, { createContext, useEffect, useContext, useState } from 'react';
import * as firebase from 'firebase/app';
import { User } from 'firebase';
import '@firebase/firestore'; // 👈 If you're using firestore
import '@firebase/auth';
import '@firebase/analytics';

type Status = 'init' | 'user' | 'profile';

const myFirebaseApp = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
});

if (process.env.NODE_ENV !== 'development') firebase.analytics();
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
  const authStorage = authStorageJson ? JSON.parse(authStorageJson) : null;
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
