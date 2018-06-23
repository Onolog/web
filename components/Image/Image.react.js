import React from 'react';

/**
 * Image.react
 *
 * React wrapper around standard HTML <img> tag
 */
class Image extends React.Component {
  render() {
    const {alt, ...props} = this.props;

    return <img {...props} alt={alt} />;
  }
}

Image.defaultProps = {
  alt: '', // For a11y.
};

module.exports = Image;
