/**
 *
 * PrivateRoute
 *
 */

import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';

import { useAuth } from 'app/containers/Database/firebase';

import { useInjectReducer } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';

interface Props {
  component: (props) => JSX.Element;
  exact?: boolean;
  path?: string;
}

export function PrivateRoute({ component: Component, ...rest }: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });

  const { user } = useAuth();
  const location = useLocation();

  return (
    <Route
      {...rest}
      render={props =>
        user ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: location.pathname } }}
          />
        )
      }
    />
  );
}
