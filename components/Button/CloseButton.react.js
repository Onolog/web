import cx from 'classnames';
import React from 'react';

const CloseButton = (props) => (
  <button
    {...this.props}
    className={cx(this.props.className, 'close')}
    type="button">
    <span aria-hidden="true">&times;</span>
    <span className="sr-only">Close</span>
  </button>
);

export default CloseButton;
