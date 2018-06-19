import cx from 'classnames';
import React from 'react';

/**
 * NavbarToggle
 *
 * Custom version of ReactBootstrap Navbar.Toggle, which allows adding
 * classnames and attaching click handlers.
 */
const NavbarToggle = (props) => {
  return (
    <button
      {...props}
      className={cx('navbar-toggle', props.className)}
      type="button">
      <span className="sr-only">Toggle navigation</span>
      <span className="icon-bar" />
      <span className="icon-bar" />
      <span className="icon-bar" />
    </button>
  );
};

module.exports = NavbarToggle;
