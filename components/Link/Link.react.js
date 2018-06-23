import PropTypes from 'prop-types';
import React from 'react';

import {RETURN} from '../../constants/KeyCode';

/**
 * Link.react
 *
 * React wrapper around standard HTML <a> tag
 */
class Link extends React.Component {
  render() {
    const {children, role, ...props} = this.props;

    /* eslint-disable jsx-a11y/no-static-element-interactions */
    return (
      <a
        {...props}
        onClick={this._handleClick}
        onKeyDown={this._handleKeyDown}
        role={role}>
        {children}
      </a>
    );
    /* eslint-enable jsx-a11y/no-static-element-interactions */
  }

  _handleClick = (e) => {
    if (this.props.href === '#') {
      e.preventDefault();
    }
    this.props.onClick && this.props.onClick(e);
  }

  _handleKeyDown = (e) => {
    e.keyCode === RETURN && this._handleClick(e);
  }
}

Link.propTypes = {
  href: PropTypes.string,
  role: PropTypes.string,
};

Link.defaultProps = {
  href: '#',
  role: 'link',
};

export default Link;
