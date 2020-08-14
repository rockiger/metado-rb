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

import { LoginPage } from './components/LoginPage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { BoardsPage } from './containers/BoardsPage/Loadable';
import { HomePage } from './containers/HomePage/Loadable';
import { PrivateRoute } from './containers/PrivateRoute';

export function App() {
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <PrivateRoute exact path="/boards" component={BoardsPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
