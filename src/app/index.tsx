/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter, Link } from 'react-router-dom';
import styled from 'styled-components/macro';

import { GlobalStyle } from 'styles/global-styles';

import { PrivateRoute } from './components/PrivateRoute';
import { HomePage } from './containers/HomePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { BoardsPage } from './containers/BoardsPage/Loadable';

export function App() {
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>
      <Horizontal>
        <Link to="/">Home</Link>
        <Link to="/boards">Boards</Link>
      </Horizontal>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <PrivateRoute exact path="/boards" component={BoardsPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}

const Horizontal = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-evenly;
  height: 5rem;
  box-shadow: ${p => p.theme.shadows[4]};
`;
