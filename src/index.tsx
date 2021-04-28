/**
 * index.tsx
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

import './utils/globals';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as serviceWorker from 'serviceWorker';
import { ThemeProvider } from 'styled-components';
import 'sanitize.css/sanitize.css';

// Import root app
import { App } from 'app';

import { HelmetProvider } from 'react-helmet-async';

import { theme } from 'styles/theme';

// Initialize languages
import './locales/i18n';
import { AuthProvider } from 'app/containers/Database/firebase';

// Remove console.log from production
if (process.env.NODE_ENV !== 'development') console.log = () => {};

const MOUNT_NODE = document.getElementById('root') as HTMLElement;

interface Props {
  Component: typeof App;
}
const ConnectedApp = ({ Component }: Props) => (
  <ThemeProvider theme={theme}>
    <AuthProvider>
      <HelmetProvider>
        <React.StrictMode>
          <Component />
        </React.StrictMode>
      </HelmetProvider>
    </AuthProvider>
  </ThemeProvider>
);
const render = (Component: typeof App) => {
  ReactDOM.render(<ConnectedApp Component={Component} />, MOUNT_NODE);
};

if (module.hot) {
  // Hot reloadable translation json files and app
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept(['./app', './locales/i18n'], () => {
    ReactDOM.unmountComponentAtNode(MOUNT_NODE);
    const App = require('./app').App;
    render(App);
  });
}

render(App);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
