import PropTypes from 'prop-types';
import React from 'react';
import cx from 'classnames';

/**
 * Menu.react
 *
 * Menu used in a dropdown.
 */
class Menu extends React.Component {
  static displayName = 'Menu';

  static propTypes = {
    /**
     * Horizontal alignment of the menu.
     */
    align: PropTypes.oneOf(['left', 'right']),
  };

  static defaultProps = {
    align: 'left',
  };

  render() {
    return (
      <ul
        className={cx('dropdown-menu', {
          'dropdown-menu-right': this.props.align === 'right',
        })}
        role="menu">
        {this.props.children}
      </ul>
    );
  }
}

module.exports = Menu;
