// @flow

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary.react';

import routes, { type RouteType } from '../routes';

const App = () => (
  <ErrorBoundary>
    <Switch>
      {routes.map((route: RouteType) => <Route key={route.path} {...route} />)}
    </Switch>
  </ErrorBoundary>
);

export default App;
