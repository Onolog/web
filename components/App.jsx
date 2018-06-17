import React from 'react';
import {Link, Switch, Route} from 'react-router-dom';

import Header from './Header';
import routes from '../routes';

const Footer = (props) => (
  <footer className="app-footer">
    <div className="container clearfix">
      <div className="pull-left">
        Copyright &copy; {(new Date()).getFullYear()} Onolog
      </div>
      <div className="pull-right">
        <Link to={{pathname: '/privacy'}}>
          Privacy
        </Link>
        <span className="middot">&middot;</span>
        <Link to={{pathname: '/terms'}}>
          Terms
        </Link>
      </div>
    </div>
  </footer>
);

class App extends React.Component {
  render() {
    return (
      <div className="app" style={{paddingTop: '80px'}}>
        <Header />
        <div className="container">
          <Switch>
            {routes.map(route => <Route key={route.path} {...route} />)}
          </Switch>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
