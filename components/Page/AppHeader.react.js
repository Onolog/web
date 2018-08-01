import PropTypes from 'prop-types';
import React from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {LinkContainer} from 'react-router-bootstrap';

import AccountNavItem from '../Navigation/AccountNavItem.react';
import FBImage from '../Facebook/FBImage.react';

import getHomePath from '../../utils/getHomePath';

import './css/AppHeader.css';

/**
 * AppHeader.react
 */
class AppHeader extends React.Component {
  render() {
    const {user} = this.props;

    return (
      <Navbar
        className="app-header"
        fixedTop
        fluid
        inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={{pathname: getHomePath()}}>Onolog</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this._renderMainMenu(user)}
          {this._renderAccountMenu(user)}
          {this._renderLoginLink(user)}
        </Navbar.Collapse>
      </Navbar>
    );
  }

  _renderAccountMenu = (user) => {
    if (user.id) {
      const title =
        <span>
          <FBImage
            className="account-img"
            fbid={user.id}
            height={24}
            width={24}
          />
          <span className="account-name ellipses">
            {user.name}
          </span>
        </span>;

      return (
        <Nav pullRight>
          <AccountNavItem
            arrow
            className="account-menu"
            title={title}
            user={user}
          />
        </Nav>
      );
    }
  };

  _renderMainMenu = (user) => {
    if (user.id) {
      const links = [
        {label: 'Calendar', pathname: getHomePath()},
        {label: 'Profile', pathname: `/users/${user.id}`},
        {label: 'Shoes', pathname: '/shoes'},
      ];

      return (
        <Nav>
          {links.map(({label, pathname}, idx) => (
            <LinkContainer key={idx} to={{pathname}}>
              <NavItem>{label}</NavItem>
            </LinkContainer>
          ))}
        </Nav>
      );
    }
  };

  /**
   * If there's no user info, it means the user isn't logged in. Prompt them
   * to do so.
   */
  _renderLoginLink = (user) => {
    if (!user.id) {
      return (
        <Nav pullRight>
          <NavItem href="/auth/facebook">
            Sign In
          </NavItem>
        </Nav>
      );
    }
  }
}

AppHeader.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = ({session}) => ({
  user: session.user,
});

export default connect(mapStateToProps)(AppHeader);
