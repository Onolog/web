import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import AccountNavItem from '../Navigation/AccountNavItem.react';
import BaseAppPage from './BaseAppPage.react';
import FBImage from '../Facebook/FBImage.react';
import FlexContainer from '../FlexContainer/FlexContainer.react';
import NavbarToggle from '../Navigation/NavbarToggle.react';
import ScrollContainer from '../ScrollContainer/ScrollContainer.react';
import SideMenu from './SideMenu.react';
import SideNav from '../Navigation/SideNav.react';

import { toggleSideNav } from '../../actions';

import './css/AppFullPage.scss';

const SideColumn = ({ onToggle, open, user }) => (
  <FlexContainer className="side-col" column>
    <div className="side-col-header clearfix">
      <div className="side-col-brand">Onolog</div>
      <NavbarToggle onClick={onToggle} />
    </div>
    <ScrollContainer className="side-col-menu-container">
      <SideMenu open={open} user={user} />
    </ScrollContainer>
    <SideNav>
      <AccountNavItem
        arrow
        className="app-side-nav-item"
        dropup
        noCaret
        title={
          <span>
            <FBImage fbid={user.id} height={40} width={40} />
            <SideNav.ItemLabel>
              {user.name}
            </SideNav.ItemLabel>
          </span>
        }
        user={user}
      />
    </SideNav>
  </FlexContainer>
);

const SideColBackdrop = ({ onToggle, open }) => {
  return open ?
    <div
      className="side-col-backdrop modal-backdrop fade in"
      onClick={onToggle}
      role="presentation"
    /> :
    null;
};

/**
 * AppFullPage.react
 */
const AppFullPage = (props) => {
  const { children, className, handleToggle, open, session, title } = props;

  return (
    <BaseAppPage
      className={cx('app-full-page', { open }, className)}
      title={title}>
      <SideColumn
        onToggle={handleToggle}
        open={open}
        user={session.user}
      />
      <SideColBackdrop
        onToggle={handleToggle}
        open={open}
      />
      <FlexContainer className="main-col" column>
        {children}
      </FlexContainer>
    </BaseAppPage>
  );
};

AppFullPage.propTypes = {
  open: PropTypes.bool.isRequired,
  session: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.string,
    }),
  }).isRequired,
};

const mapStateToProps = ({ session, ui }) => {
  return {
    session,
    open: !!ui.sideNavOpen,
  };
};

const mapDispatchToProps = {
  handleToggle: toggleSideNav,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppFullPage);
