import React from 'react';
import {withRouter} from 'react-router-dom';

import AppFullPage from '../../components/Page/AppFullPage.react';
import Link from '../../components/Link/Link.react';
import MaterialIcon from '../../components/Icons/MaterialIcon.react';
import Middot from '../../components/Middot.react';

import './styles/NotFound.scss';

/**
 * NotFoundController.react
 *
 * Catch-all page if a route doesn't match.
 */
const NotFoundController = ({history}) => (
  <AppFullPage title="Page Not Found">
    <div className="error-page">
      <div className="container">
        <h2>Page not found.</h2>
        <MaterialIcon
          className="error-page-icon"
          icon="alert-octagram"
        />
        <p>
          The link you followed may be broken, or the page may have been
          removed.
        </p>
        <ul className="list-inline">
          <li>
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

export default withRouter(NotFoundController);
