import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Col, Row } from 'react-bootstrap';

import './FlexContainer.scss';

const FlexContainer = ({ children, className, column }) => {
  const Component = column ? Col : Row;

  return (
    <Component
      className={cx('flex-container', {
        'flex-col': column,
        'flex-row': !column,
      }, className)}>
      {children}
    </Component>
  );
};

FlexContainer.propTypes = {
  column: PropTypes.bool,
};

FlexContainer.defaultProps = {
  column: false,
};

export default FlexContainer;
