import PropTypes from 'prop-types';
import React from 'react';

import cx from 'classnames';

/**
 * ImageBlock.react
 */
class ImageBlock extends React.Component {
  static displayName = 'ImageBlock';

  static propTypes = {
    align: PropTypes.oneOf(['top', 'middle', 'bottom']),
    image: PropTypes.object.isRequired,
  };

  static defaultProps = {
    align: 'top',
  };

  render() {
    const {align} = this.props;

    return (
      <div className="media">
        <div className="media-left">
          {this.props.image}
        </div>
        <div className={cx('media-body', {
          'media-top': align === 'top',
          'media-middle': align === 'middle',
          'media-bottom': align === 'bottom',
        })}>
          {this.props.children}
        </div>
      </div>
    );
  }
}

module.exports = ImageBlock;
