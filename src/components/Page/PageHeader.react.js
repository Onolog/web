import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import NavbarToggle from '../Navigation/NavbarToggle.react';

import { toggleSideNav } from '../../actions';

import './css/PageHeader.css';

/**
 * PageHeader
 */
const PageHeader = (props) => {
  const { children, className, full, title, toggleSideNav } = props;

  const navbarToggle = full ?
    <div className="app-page-header-toggle">
      <NavbarToggle
        className="visible-xs-block"
        onClick={toggleSideNav}
      />
    </div> :
    null;

  return (
    <header
      className={cx('app-page-header', {
        'app-page-header-full': full,
      }, className)}>
      {navbarToggle}
      <h2>{title}</h2>
      <div className="app-page-header-aux">
        {children}
      </div>
    </header>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  toggleSideNav: () => dispatch(toggleSideNav()),
});

export default connect(null, mapDispatchToProps)(PageHeader);
