import React from 'react';
import { Link } from 'react-router-dom';

import LeftRight from '../LeftRight/LeftRight.react';
import Middot from '../Middot.react';

import './css/AppFooter.css';

/**
 * AppFooter.react
 */
const AppFooter = (props) => (
  <footer className="app-footer">
    <LeftRight className="container-fluid">
      <div>Copyright &copy; {(new Date()).getFullYear()} Onolog</div>
      <div>
        <Link to={{ pathname: '/privacy' }}>
          Privacy
        </Link>
        <Middot />
        <Link to={{ pathname: '/terms' }}>
          Terms
        </Link>
      </div>
    </LeftRight>
  </footer>
);

export default AppFooter;
