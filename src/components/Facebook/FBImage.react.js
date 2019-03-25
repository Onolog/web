import PropTypes from 'prop-types';
import { stringify } from 'qs';
import React from 'react';

import Image from '../Image/Image.react';

const GRAPH_URL = 'https://graph.facebook.com';

/**
 * FBImage.react
 *
 * Given an fbid, retrieves and renders an FB graph image.
 */
const FBImage = ({ className, fbid, height, width }) => {
  // Double the height and width for retina displays
  const params = stringify({
    height: height * 2,
    width: width * 2,
  });

  return (
    <Image
      className={className}
      height={Math.floor(height)}
      src={`${GRAPH_URL}/${fbid}/picture?${params}`}
      width={Math.floor(width)}
    />
  );
};

FBImage.propTypes = {
  fbid: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
};

FBImage.defaultProps = {
  height: 50,
  width: 50,
};

export default FBImage;
