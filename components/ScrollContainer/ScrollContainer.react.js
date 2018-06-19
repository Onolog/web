import cx from 'classnames';
import React from 'react';

import './css/ScrollContainer.css';

const ScrollContainer = (props) => (
  <div className={cx('scroll-container', props.className)}>
    {props.children}
  </div>
);

export default ScrollContainer;
