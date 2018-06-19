import React from 'react';

/**
 * HiddenInput.react
 *
 * React wrapper around a standard hidden input element.
 */
class HiddenInput extends React.Component {
  static displayName = 'HiddenInput';

  render() {
    return <input {...this.props} type="hidden" />;
  }
}

module.exports = HiddenInput;
