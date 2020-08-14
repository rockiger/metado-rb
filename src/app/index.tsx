/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { GlobalStyle } from 'styles/global-styles';

import { LoginPage } from './components/LoginPage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { BoardPage } from './containers/BoardPage/Loadable';
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
        <PrivateRoute exact path="/board" component={BoardPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
