import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import './MaterialIcon.scss';

const MaterialIcon = (props) => {
  const { className, dark, flip, icon, inactive, rotate, size } = props;

  return (
    <i
      aria-hidden="true"
      className={cx(
        'mdi',
        `mdi-${icon}`,
        `mdi-${size}px`,
        `mdi-rotate-${rotate}`,
        {
          'mdi-dark': dark,
          [`mdi-flip-${flip}`]: flip,
          'mdi-inactive': inactive,
        },
        className
      )}
    />
  );
};

MaterialIcon.propTypes = {
  dark: PropTypes.bool,
  flip: PropTypes.oneOf(['horizontal', 'vertical']),
  icon: PropTypes.string.isRequired,
  inactive: PropTypes.bool,
  rotate: PropTypes.oneOf([0, 45, 90, 135, 180, 225, 270, 315]),
  size: PropTypes.oneOf([18, 24, 36, 48]),
};

MaterialIcon.defaultProps = {
  dark: false,
  inactive: false,
  rotate: 0,
  size: 18,
};

export default MaterialIcon;
