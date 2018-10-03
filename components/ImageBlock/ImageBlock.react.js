import PropTypes from 'prop-types';
import React from 'react';

import cx from 'classnames';

/**
 * ImageBlock.react
 */
const ImageBlock = ({align, children, image, ...props}) => (
  <div className="media">
    <div className="media-left">
      {image}
    </div>
    <div className={cx('media-body', {
      'media-top': align === 'top',
      'media-middle': align === 'middle',
      'media-bottom': align === 'bottom',
    })}>
      {children}
    </div>
  </div>
);

ImageBlock.displayName = 'ImageBlock';

ImageBlock.propTypes = {
  align: PropTypes.oneOf(['top', 'middle', 'bottom']),
  image: PropTypes.object.isRequired,
};

ImageBlock.defaultProps = {
  align: 'top',
};

export default ImageBlock;
