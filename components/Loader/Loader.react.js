import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './Loader.scss';

/**
 * Loader.react
 *
 * Displays a loading indicator.
 */
const Loader = (props) => {
  const { background, size, full, className } = props;

  return (
    <div
      className={cx('loader', {
        'loader-bg': background,
        'loader-full': full,
      }, className)}>
      <i
        className={cx('loader-icon', {
          'loader-icon-lg': size === 'large',
        })}
      />
    </div>
  );
};

Loader.propTypes = {
  background: PropTypes.bool,
  full: PropTypes.bool,
  size: PropTypes.oneOf(['large', 'small']),
};

Loader.defaultProps = {
  background: false,
  full: false,
  size: 'large',
};

export default Loader;
