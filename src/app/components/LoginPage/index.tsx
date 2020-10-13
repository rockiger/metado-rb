/**
 *
 * LoginPage
 *
 */
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link, Redirect } from 'react-router-dom';
import firebase from 'firebase';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

import { db, firebaseAuth, useAuth } from 'app/containers/Database/firebase';

interface Props {
  location: any;
}

export function LoginPage({ location }: Props) {
  const from = location && location.state && location.state.from;
  const { user } = useAuth();
  const signInSuccessUrl = from || '/b';

  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl,
    signInOptions: [
      // firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    callbacks: {
      signInSuccessWithAuthResult: signInSuccessCallback,
    },
  };

  if (user) {
    return <Redirect to="/b" />;
  }

  return (
    <Container>
      <Left>
        <LogoContainer>
          <Link to="/">
            <Img
              src={`${process.env.PUBLIC_URL}/metado_logo_primary.svg`}
              alt="Metado logo"
            />
          </Link>
        </LogoContainer>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
      </Left>
      <Right>
        <H1>Plan Your Life</H1>
      </Right>
    </Container>
  );
}

function signInSuccessCallback(authResult) {
  const { uid, displayName, email } = authResult.user;
  const { user } = authResult;
  console.log('signInSuccessCallback', {
    isNewUser: authResult.additionalUserInfo.isNewUser,
    uid,
    displayName,
    email,
  });

  if (authResult.additionalUserInfo.isNewUser) {
    setupNewUser(user);
  }
  return false;
}

function setupNewUser(user) {
  console.log('setupNewUser', user.uid);
  const userRef = db.collection('users').doc(user.uid);
  const board = {
    columns: [
      { taskIds: [], title: 'Backlog' },
      { taskIds: [], title: 'Todo' },
      { taskIds: [], title: 'Doing' },
      { taskIds: [], title: 'Done' },
    ],
    id: 'main-board',
    isDeleted: false,
    projects: [],
    showBacklog: true,
    title: 'Main Board',
  };
  const boardRef = db
    .collection('users')
    .doc(user.uid)
    .collection('boards')
    .doc(board.id);

  userRef
    .set({ activeBoard: 'main-board' }, { merge: true })
    .then(() => console.log('setupNewUserSuccessSetActiveBoard'))
    .catch(error => console.error(error));

  boardRef
    .set(board)
    .then(() => console.log('setupNewUserSuccessSetBoard'))
    .catch(error => console.error(error));

  return true;
}

const Container = styled.div`
  height: calc(100vh);
  display: flex;
`;

const Left = styled.div`
  height: 100%;
  padding-top: 16vh;
  width: 100%;
  ${media.greaterThan('medium')`
    width: 34%;
  `}

  .firebaseui-idp-list>.firebaseui-list-item {
    margin-bottom: 1.5rem;
  }

  .firebaseui-idp-button {
    height: 5.6rem;
    max-width: 25rem;
  }

  .firebaseui-idp-icon {
    height: 2.4rem;
    width: 2.4rem;
  }

  .firebaseui-idp-text {
    font-family: ${p => p.theme.fontFamily};
    font-size: 1.8rem;
  }
`;

const LogoContainer = styled.div`
  max-width: 25rem;
  margin: 0 auto;
  padding-bottom: 16vh;
`;
const Img = styled.img``;

const Right = styled.div`
  display: none;
  ${media.greaterThan('medium')`
    background-color: ${p => p.theme.palette.tertiary.light};
    background-image: url("${
      process.env.PUBLIC_URL
    }/images/login-background.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 12.8rem;
    width: 66%;
  `}
`;

const H1 = styled.h1`
  color: white;
  font-size: 6.4rem;
  font-weight: 700;
  letter-spacing: 0.1rem;
  padding-bottom: 20vh;
`;
