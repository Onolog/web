import cx from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import FlexContainer from '../FlexContainer/FlexContainer.react';
import Loader from '../Loader/Loader.react';
import ScrollContainer from '../ScrollContainer/ScrollContainer.react';

import './css/PageFrame.css';

const PageFrame = ({ children, fill, isLoading, scroll }) => {
  const Container = scroll ? ScrollContainer : 'div';
  const loader = isLoading ? <Loader background full /> : null;

  return (
    <FlexContainer className={cx('page-frame', { fill })}>
      {loader}
      <Container className="page-frame-content">
        {children}
      </Container>
    </FlexContainer>
  );
};

PageFrame.propTypes = {
  fill: PropTypes.bool,
  isLoading: PropTypes.bool,
  scroll: PropTypes.bool,
};

PageFrame.defaultProps = {
  fill: false,
  isLoading: false,
  scroll: false,
};

export default PageFrame;
