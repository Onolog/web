import React from 'react';
import {Button} from 'react-bootstrap';

import MaterialIcon from '../Icons/MaterialIcon.react';

import './css/FBLoginButton.scss';

/**
 * FBLoginButton.react
 *
 * Renders a custom React FB login button.
 */
const FBLoginButton = (props) => (
  <Button
    {...props}
    bsSize="large"
    bsStyle="primary"
    className="fb-login-button"
    href="/auth/facebook">
    <MaterialIcon className="fb-icon" icon="facebook-box" size={24} />
    Sign in with Facebook
  </Button>
);

export default FBLoginButton;
