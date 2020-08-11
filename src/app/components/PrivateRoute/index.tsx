import React from 'react';
import { Route } from 'react-router-dom';

interface Props {
  component: (name: string) => React.ReactNode;
}

export function PrivateRoute({ component: Component, ...rest }) {
  return <Route {...rest} render={props => <Component {...props} />} />;
}

export default PrivateRoute;
