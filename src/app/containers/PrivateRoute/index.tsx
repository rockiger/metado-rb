/**
 *
 * PrivateRoute
 *
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import { selectIsAuthenticated } from 'app/containers/Database/selectors';

import { useInjectReducer } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';

interface Props {
  component: (props) => JSX.Element;
  exact?: boolean;
  path?: string;
}

export function PrivateRoute({ component: Component, ...rest }: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });

  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
      }
    />
  );
}
