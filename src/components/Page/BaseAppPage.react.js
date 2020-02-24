import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const setTitle = (title) => {
  const prefix = 'Onolog';
  document.title = title ? `${prefix} \u00b7 ${title}` : prefix;
};

/**
 * BaseAppPage.react
 *
 * Base component for rendering the app page, with code that should execute on
 * every page.
 */
class BaseAppPage extends React.Component {
  componentDidMount() {
    // Set the browser page title.
    setTitle(this.props.title);
  }

  /* eslint-disable-next-line camelcase */
  UNSAFE_componentWillReceiveProps(nextProps) {
    // Update the browser page title on transitions.
    if (this.props.title !== nextProps.title) {
      setTitle(nextProps.title);
    }
  }

  render() {
    return (
      <div className={cx('app', this.props.className)}>
        {this.props.children}
      </div>
    );
  }
}

BaseAppPage.propTypes = {
  title: PropTypes.string,
};

export default BaseAppPage;
