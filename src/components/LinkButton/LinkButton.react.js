/* eslint-disable react/button-has-type */

import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './LinkButton.scss';

/**
 * Unstyled, a11y-friendly replacement for link elements.
 */
const LinkButton = ({ block, className, type, ...props }) => (
  <button
    {...props}
    className={cx('linkButton', { block }, className)}
    type={type}
  />
);

LinkButton.props = {
  /**
   * Have the button behave like a block-level element.
   */
  block: PropTypes.bool,
  type: PropTypes.oneOf(['button', 'submit', 'reset']).isRequired,
};

LinkButton.defaultProps = {
  type: 'button',
};

export default LinkButton;
