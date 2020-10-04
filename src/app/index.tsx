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

import { AddGithubRepo } from './containers/AddGithubRepo/Loadable';
import { AddGoogleTasklist } from './containers/AddGoogleTasklist/Loadable';
import { BoardPage } from './containers/BoardPage/Loadable';
import { LoginPage } from './components/LoginPage/Loadable';
import { HomePage } from './containers/HomePage/Loadable';
import { NotFoundPage } from './components/NotFoundPage/Loadable';
import { PrivateRoute } from './containers/PrivateRoute';
import { PrivacyPage } from './containers/PrivacyPage/Loadable';
import { TermsPage } from './containers/TermsPage/Loadable';

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
        <PrivateRoute path="/b/:ownerId/:boardId" component={BoardPage} />
        <PrivateRoute path="/b/:ownerId" component={BoardPage} />
        <PrivateRoute path="/b" component={BoardPage} />
        <Route exact path="/login" component={LoginPage} />
        <Route exact path="/privacy" component={PrivacyPage} />
        <Route exact path="/projects/add/github" component={AddGithubRepo} />
        <Route
          exact
          path="/projects/add/github/:step"
          component={AddGithubRepo}
        />
        <Route
          exact
          path="/projects/add/googletasks"
          component={AddGoogleTasklist}
        />
        <Route
          exact
          path="/projects/add/googletasks/:step"
          component={AddGoogleTasklist}
        />
        <Route exact path="/terms" component={TermsPage} />

        <Route component={NotFoundPage} />
      </Switch>
      <GlobalStyle />
    </BrowserRouter>
  );
}
