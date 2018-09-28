import PropTypes from 'prop-types';
import {stringify} from 'qs';
import React from 'react';

import {APP_ID} from '../../constants/Facebook';
import {URL} from '../../constants/Onolog';

const FB_URL = '//www.facebook.com/plugins/like.php';

/**
 * FBLikeButton.react
 *
 * Renders the Like button plugin for the specified URL.
 *
 * Documentation: https://developers.facebook.com/docs/plugins/like-button/
 *
 * TODO: Although we're including the FB SDK globally, it really should be
 * included individually by each module that needs it.
 */
class FBLikeButton extends React.Component {
  static displayName = 'FBLikeButton';

  static propTypes = {
    href: PropTypes.string.isRequired,
    /**
     * Specify the label to be displayed in the button
     */
    action: PropTypes.oneOf([
      'like',
      'recommend',
    ]),
    /**
     * standard: Horizontally aligned button(s) with a string indicating how
     *    many people like the given URL, and/or a prompt to like it.
     *
     * box_count: Vertically stacked buttons with a large count above.
     *
     * button_count: Horizontally aligned button(s) with small count to
     *    the right.
     *
     * button: Horizontally aligned button(s), no count.
     */
    layout: PropTypes.oneOf([
      'standard',
      'box_count',
      'button_count',
      'button',
    ]),
    /**
     * Show profile photos when 2 or more friends like the URL.
     */
    showFaces: PropTypes.bool,
    /**
     * Includes a Share button beside the Like button.
     */
    useShare: PropTypes.bool,
  };

  /**
   * Use the FB defaults
   */
  static defaultProps = {
    action: 'like',
    layout: 'standard',
    showFaces: true,
    useShare: true,
    width: 165,
  };

  render() {
    var params = stringify({
      href: URL + this.props.href,
      width: this.props.width,
      layout: this.props.layout,
      action: this.props.action,
      show_faces: this.props.showFaces,
      share: this.props.useShare,
      height: this._getHeight(),
      appId: APP_ID,
    });

    return (
      <iframe
        allowtransparency="true"
        frameBorder="0"
        scrolling="no"
        src={`${FB_URL}?${params}`}
        style={{
          border: 'none',
          overflow: 'hidden',
          height: `${this._getHeight()}px`,
          width: `${this.props.width}px`,
        }}
        title="Facebook Like"
      />
    );
  }

  _getHeight = () => {
    var heights = {
      'standard': this.props.showFaces ? 80 : 35,
      'box_count': 65,
      'button_count': 21,
      'button': 35,
    };
    return heights[this.props.layout];
  };
}

export default FBLikeButton;
