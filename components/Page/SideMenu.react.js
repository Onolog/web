import PropTypes from 'prop-types';
import React from 'react';

import SideNav from '../Navigation/SideNav.react';
import getHomePath from '../../utils/getHomePath';

function getNavItems(user) {
  return [
    {
      href: getHomePath(),
      icon: 'calendar',
      label: 'Calendar',
    },
    {
      href: `/users/${user.id}`,
      icon: 'account',
      label: 'Profile',
    },
    {
      href: '/data',
      icon: 'chart-areaspline',
      label: 'Data',
    },
    {
      href: '/shoes',
      icon: 'run',
      label: 'Shoes',
    },
    // {
    //   href: '/friends',
    //   icon: 'account-multiple',
    //   label: 'Friends',
    // },
    {
      href: '/settings',
      icon: 'settings',
      label: 'Settings',
    },
  ];
}

const SideMenu = ({open, user}) => (
  <SideNav>
    {getNavItems(user).map((item, idx) => (
      <SideNav.Item
        icon={<SideNav.Icon icon={item.icon} />}
        key={idx}
        open={open}
        pathname={item.href}>
        {item.label}
      </SideNav.Item>
    ))}
  </SideNav>
);

SideMenu.propTypes = {
  open: PropTypes.bool.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
  }).isRequired,
};

export default SideMenu;
