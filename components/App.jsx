import React from 'react';
import {connect} from 'react-redux';
import {Link, Switch, Route} from 'react-router-dom';

import routes from '../routes';

const mapStateToProps = ({session}) => ({
  session,
});

const Header = connect(mapStateToProps)(({session}) => {
  return session.user ?
    <ul className="list-inline">
      <li><Link to="/home">Home</Link></li>
      <li><Link to="/about">About</Link></li>
    </ul> :
    null;
});

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>Onolog</h1>
        <Header />
        <Switch>
          {routes.map(route => <Route key={route.path} {...route} />)}
        </Switch>
      </div>
    );
  }
}

export default App;
