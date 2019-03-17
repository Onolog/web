import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const AppContent = (props) => (
  <div className={cx('app-page-content', { 'narrow-page': props.narrow })}>
    <div className="clearfix container-fluid">
      {props.children}
    </div>
  </div>
);

AppContent.propTypes = {
  narrow: PropTypes.bool,
};

AppContent.defaultProps = {
  narrow: false,
};

export default AppContent;
