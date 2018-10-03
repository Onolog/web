import React from 'react';

/**
 * Image.react
 *
 * React wrapper around standard HTML <img> tag
 */
const Image = ({alt, ...props}) => <img {...props} alt={alt} />;

Image.defaultProps = {
  alt: '', // For a11y.
};

export default Image;
