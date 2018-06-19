import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import AccountNavItem from '../Navigation/AccountNavItem.react';
import BaseAppPage from './BaseAppPage.react';
import FBImage from '../Facebook/FBImage.react';
import FlexContainer from '../FlexContainer/FlexContainer.react';
import NavbarToggle from '../Navigation/NavbarToggle.react';
import ScrollContainer from '../ScrollContainer/ScrollContainer.react';
import SideMenu from './SideMenu.react';
import SideNav from '../Navigation/SideNav.react';

import {toggleSideNav} from '../../actions';

import './css/AppFullPage.scss';

const SideColumn = ({onToggle, open, user}) => (
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

class SideColBackdrop extends React.Component {
  render() {
    return this.props.open ?
      <div
        className="side-col-backdrop modal-backdrop fade in"
        onClick={this.props.onToggle}
      /> : null;
  }
}

/**
 * AppFullPage.react
 */
const AppFullPage = ({children, className, handleToggle, open, session, title}) => {
  return (
    <BaseAppPage
      className={cx('app-full-page', {'open': open}, className)}
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
      id: PropTypes.number,
    }),
  }).isRequired,
};

const mapStateToProps = ({navigation, session}) => {
  return {
    session,
    open: !!(navigation && navigation.sideNavOpen),
  };
};

const mapDispatchToProps = {
  handleToggle: toggleSideNav,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppFullPage);
