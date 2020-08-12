/**
 *
 * LoginPage
 *
 */
import React from 'react';
import styled from 'styled-components/macro';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import media from 'styled-media-query';
import { firebaseAuth } from 'app/containers/Database/firebase';

interface Props {}

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'redirect',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/boards',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};

export function LoginPage(props: Props) {
  return (
    <Container>
      <Left>
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebaseAuth} />
      </Left>
      <Right></Right>
    </Container>
  );
}

const Container = styled.div`
  height: calc(100vh);
  display: flex;
`;

const Left = styled.div`
  padding-top: 6rem;
  width: 100%;
  height: 100%;
  ${media.greaterThan('medium')`
    width: 34%;
  `}
`;

const Right = styled.div`
  background-color: blue;
  display: none;
  height: 100%;
  width: 64%;
  ${media.greaterThan('medium')`
    /* screen width is greater than 1170px (large) */
    display: block;
  `}
`;
