import PropTypes from 'prop-types';
import React from 'react';

import Image from '../Image/Image.react';

import param from '../../utils/param';

const GRAPH_URL = 'https://graph.facebook.com';

/**
 * FBImage.react
 *
 * Given an fbid, retrieves and renders an FB graph image.
 */
class FBImage extends React.Component {
  static displayName = 'FBImage';

  static propTypes = {
    fbid: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
    height: PropTypes.number,
    width: PropTypes.number,
  };

  static defaultProps = {
    height: 50,
    width: 50,
  };

  render() {
    const {fbid, height, width} = this.props;

    // Double the height and width for retina displays
    const params = param({
      height: height * 2,
      width: width * 2,
    });

    return (
      <Image
        className={this.props.className}
        height={Math.floor(height)}
        src={`${GRAPH_URL}/${fbid}/picture?${params}`}
        width={Math.floor(width)}
      />
    );
  }
}

module.exports = FBImage;
