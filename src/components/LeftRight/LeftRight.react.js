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
const LeftRight = (props) => {
  const children = [];

  React.Children.forEach(props.children, (child) => {
    children.push(child);
  });

  const dir = props.direction || DIRECTION.both;
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
      {...props}
      className={cx(props.className, 'clearfix')}>
      {orderedChildren}
    </div>
  );
};

LeftRight.propTypes = {
  direction: PropTypes.oneOf(Object.keys(DIRECTION)),
};

LeftRight.defaultProps = {
  direction: DIRECTION.both,
};

export default LeftRight;
