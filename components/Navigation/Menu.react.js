import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

/**
 * Menu.react
 *
 * Menu used in a dropdown.
 */
const Menu = props => (
  <ul
    className={cx('dropdown-menu', {
      'dropdown-menu-right': props.align === 'right',
    })}
    role="menu">
    {props.children}
  </ul>
);

Menu.displayName = 'Menu';

Menu.propTypes = {
  /**
   * Horizontal alignment of the menu.
   */
  align: PropTypes.oneOf(['left', 'right']),
};

Menu.defaultProps = {
  align: 'left',
};

export default Menu;
