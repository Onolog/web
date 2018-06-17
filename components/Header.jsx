import React from 'react';
import {Nav, Navbar, NavItem} from 'react-bootstrap';
import {connect} from 'react-redux';
import {LinkContainer} from 'react-router-bootstrap';
import {Link, NavLink} from 'react-router-dom';

class Header extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    const {router: {location: {pathname}}} = this.props;
    return pathname !== nextProps.router.location.pathname;
  }

  render() {
    const {session} = this.props;

    const links = session.user ? [
      {label: 'Home', pathname: '/home'},
      {label: 'Activities', pathname: '/activities'},
      {label: 'Shoes', pathname: '/shoes'},
    ] : [];

    const authLink = session.user ?
      {children: 'Logout', href: '/logout'} :
      {children: 'Login', href: '/auth/facebook'};

    return (
      <Navbar className="app-header" fixedTop inverse>
        <Navbar.Header>
          <Navbar.Brand>
            <Link to={{pathname: '/home'}}>Onolog</Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav pullRight>
            {links.map(({label, pathname}) => (
              <LinkContainer key={pathname} to={pathname}>
                <NavItem>{label}</NavItem>
              </LinkContainer>
            ))}
            <NavItem {...authLink} />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
};

const mapStateToProps = ({router, session}) => ({
  router,
  session,
});

export default connect(mapStateToProps)(Header);
