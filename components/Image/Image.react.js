import React from 'react';

/**
 * Image.react
 *
 * React wrapper around standard HTML <img> tag
 */
class Image extends React.Component {
  static displayName = 'Image';

  render() {
    return <img {...this.props} />;
  }
}

module.exports = Image;
