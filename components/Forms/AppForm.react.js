import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {Form} from 'react-bootstrap';

import './css/AppForm.scss';

/**
 * Wrapper around react-bootstrap Form component for app-specific styling.
 */
const AppForm = ({bordered, className, ...props}) => (
  <Form
    {...props}
    className={cx('app-form', {
      'app-form-bordered': bordered,
    }, className)}
    componentClass={props.onSubmit || props.action ? 'form' : 'div'}
  />
);

AppForm.propTypes = {
  bordered: PropTypes.bool,
};
AppForm.defaultProps = {
  bordered: false,
};

export default AppForm;
