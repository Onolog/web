import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

const DIRECTION = {
  left: 'left',
  right: 'right',
  both: 'both',
};

/**
 * LeftRight.react.js
 *
 * Simple left right positioning tool.
 */
class LeftRight extends React.Component {
  static displayName = 'LeftRight';

  static propTypes = {
    direction: PropTypes.oneOf(Object.keys(DIRECTION)),
  };

  static defaultProps = {
    direction: DIRECTION.both,
  };

  render() {
    const children = [];
    React.Children.forEach(this.props.children, (child) => {
      children.push(child);
    });

    const dir = this.props.direction || DIRECTION.both;
    const both = (dir === DIRECTION.both);

    const firstClass = both || dir === DIRECTION.left ? 'pull-left' : '';
    const secondClass = both || dir === DIRECTION.right ? 'pull-right' : '';

    const firstChild =
      <div className={firstClass} key="left">
        {children[0]}
      </div>;

    const secondChild = children.length < 2 ?
      null :
      <div className={secondClass} key="right">
        {children[1]}
      </div>;

    const orderedChildren = (dir === DIRECTION.right && secondChild) ?
      [secondChild, firstChild] :
      [firstChild, secondChild];

    return (
      <div
        {...this.props}
        className={cx(this.props.className, 'clearfix')}>
        {orderedChildren}
      </div>
    );
  }
}

export default LeftRight;
