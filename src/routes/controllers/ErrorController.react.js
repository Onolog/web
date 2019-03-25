// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';

import AppFullPage from '../../components/Page/AppFullPage.react';
import Link from '../../components/Link/Link.react';
import MaterialIcon from '../../components/Icons/MaterialIcon.react';
import Middot from '../../components/Middot.react';

import './styles/NotFound.scss';

/**
 * ErrorController
 *
 * Show this page when an error occurs.
 */
const ErrorController = ({ history }) => (
  <AppFullPage className="error" title="Error">
    <div className="error-page">
      <div className="container">
        <h2>Sorry, an error occurred.</h2>
        <MaterialIcon
          className="error-page-icon"
          icon="alert-octagram"
        />
        <ul className="list-inline">
          <li>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link onClick={history.goBack}>
              Back
            </Link>
          </li>
          <li>
            <Middot />
          </li>
          <li>
            <Link href="/">
              Home
            </Link>
          </li>
        </ul>
      </div>
    </div>
  </AppFullPage>
);

export default withRouter(ErrorController);
