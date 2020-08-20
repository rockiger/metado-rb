/**
 *
 * LoginPage
 *
 */
import React from 'react';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Link, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import firebase from 'firebase';
import styled from 'styled-components/macro';
import media from 'styled-media-query';

import { firebaseAuth } from 'app/containers/Database/firebase';
import { selectIsAuthenticated } from 'app/containers/Database/selectors';

interface Props {
  location: any;
}

export function LoginPage({ location }: Props) {
  const from = location && location.state && location.state.from;
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const signInSuccessUrl = from || '/b';
  const uiConfig = {
    signInFlow: 'redirect',
    signInSuccessUrl,
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  };

  if (isAuthenticated) {
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
    height: 3.5rem;
    max-width: 16rem;
  }

  .firebaseui-idp-icon {
    height: 1.5rem;
    width: 1.5rem;
  }

  .firebaseui-idp-text {
    font-family: ${p => p.theme.fontFamily};
    font-size: 1.2rem;
  }
`;

const LogoContainer = styled.div`
  max-width: 16rem;
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
    padding: 0 8rem;
    width: 66%;
  `}
`;

const H1 = styled.h1`
  color: white;
  font-size: 4rem;
  padding-bottom: 20vh;
`;
