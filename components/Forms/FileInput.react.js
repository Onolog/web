import React from 'react';

/**
 * FileInput.react
 *
 * React wrapper around a standard file input.
 */
class FileInput extends React.Component {
  static displayName = 'FileInput';

  render() {
    return <input {...this.props} type="file" />;
  }
}

module.exports = FileInput;
