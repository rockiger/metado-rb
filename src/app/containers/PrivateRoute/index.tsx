/**
 *
 * PrivateRoute
 *
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';

import { useInjectReducer } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectPrivateRoute } from './selectors';

interface Props {
  component: (props) => JSX.Element;
}

export function PrivateRoute({ component: Component, ...rest }: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const privateRoute = useSelector(selectPrivateRoute);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  return <Route {...rest} render={props => <Component {...props} />} />;
}
