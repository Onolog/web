import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { MenuItem, NavDropdown } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

// `NavDropdown` injects props into all its children, so we need to pass a
// component to make sure non-DOM props don't get passed to the `<li>`.
const MenuArrow = (props) => <li className="arrow" />;

const renderItem = ({ label, pathname }, idx) => (
  <LinkContainer isActive={() => false} key={pathname} to={{ pathname }}>
    <MenuItem>{label}</MenuItem>
  </LinkContainer>
);

const AccountNavItem = (props) => {
  const { arrow, className, user, ...otherProps } = props;
  const items = [
    { label: 'Profile', pathname: `/users/${user.id}` },
    { label: 'Settings', pathname: '/settings' },
  ];
  const legalItems = [
    { label: 'Privacy Policy', pathname: '/privacy' },
    { label: 'Terms & Conditions', pathname: '/terms' },
  ];

  return (
    <NavDropdown
      {...otherProps}
      className={cx('account-nav-item', { 'has-arrow': arrow }, className)}
      id="account-menu">
      {arrow && <MenuArrow />}
      {items.map(renderItem)}
      <MenuItem divider />
      {legalItems.map(renderItem)}
      <MenuItem divider />
      <MenuItem href="/logout">
        Sign Out
      </MenuItem>
    </NavDropdown>
  );
};

AccountNavItem.propTypes = {
  arrow: PropTypes.bool,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

AccountNavItem.defaultProps = {
  arrow: false,
};

export default AccountNavItem;
