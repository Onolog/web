import React from 'react';
import {Link, Switch, Route} from 'react-router-dom';

import routes from '../routes';

class App extends React.Component {
  render() {
    return (
      <Switch>
        {routes.map(route => <Route key={route.path} {...route} />)}
      </Switch>
    );
  }
}

export default App;
