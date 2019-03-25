// @flow

import React from 'react';
import { Switch, Route } from 'react-router-dom';

import ErrorBoundary from './ErrorBoundary.react';

import routes, { type RouteType } from '../routes';

const App = () => (
  <ErrorBoundary>
    <Switch>
      {routes.map((route: RouteType) => (
        <Route
          {...route}
          key={route.path}
          component={(routerProps, props) => {
            // HACK: Explicitly handle the route component.
            // @loadable/component uses `forwardRef` to wrap each
            // component. However, react-router-dom < v4.4 doesn't handle
            // `forwardRef` and warns that the component is an object instead of
            // a function. Solution would be to upgrade RR, BUT RR >= v4.4 uses
            // the new context API and breaks `react-router-bootstrap` :(
            // When RRB releases a new version that accounts for context, we can
            // then upgrade RR to v4.4 or v5 and get rid of this workaround.
            const Component = route.component;
            return <Component {...routerProps} {...props} />;
          }}
        />
      ))}
    </Switch>
  </ErrorBoundary>
);

export default App;
