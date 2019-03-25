// @flow

import React from 'react';
import { withRouter } from 'react-router-dom';

import type { History } from '../types/History';

type Props = {
  children: any,
  history: History,
};

/**
 * React error boundary to handle client-side errors.
 */
class ErrorBoundary extends React.Component<Props> {
  componentDidCatch(error: Error) {
    // Send users to the error page when an error occurs.
    // TODO: Log errors
    this.props.history.push({
      pathname: '/error',
    });
  }

  render() {
    return this.props.children;
  }
}

export default withRouter(ErrorBoundary);
