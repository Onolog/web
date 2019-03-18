import { isArray, map } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Typeahead } from 'react-bootstrap-typeahead';

import FBImage from './FBImage.react';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import './css/FBFriendTokenizer.scss';

const IMG_PX = 32;

/**
 * FriendTokenizer.react
 *
 * FB friend typeahead with name tokenizer
 */
class FBFriendTokenizer extends React.Component {
  state = {
    options: [],
    selected: [],
  };

  componentDidMount() {
    this._getFriends();
  }

  render() {
    const { selected, options } = this.state;

    return (
      <Typeahead
        className="fb-friend-tokenizer"
        id="fb-friend-tokenizer"
        labelKey="name"
        multiple
        onChange={this._handleChange}
        options={options}
        placeholder="Type a friend's name..."
        renderMenuItemChildren={this._renderMenuItemChildren}
        selected={selected}
      />
    );
  }

  _renderMenuItemChildren = (option, props, idx) => {
    return (
      <div className="fb-friend-tokenizer-item">
        <span className="innerBorder">
          <FBImage
            className="fb-friend-tokenizer-item-thumbnail"
            fbid={+option.id}
            height={IMG_PX}
            width={IMG_PX}
          />
        </span>
        <span className="fb-friend-tokenizer-item-name">
          {option.name}
        </span>
      </div>
    );
  };

  _getFriends = () => {
    // Get all taggable friends
    const batch = [{
      method: 'GET',
      relative_url: 'me/friends',
    }];

    // Get info for any already-tagged friends
    const { friends } = this.props;
    if (friends) {
      friends.toString().split(',').forEach((fbid) => {
        batch.push({
          method: 'GET',
          relative_url: `${fbid}?fields=name`,
        });
      });
    }

    // Get taggable + already tagged FB friends
    FB.api('/', 'POST', { batch }, this._handleGraphResponse);
  };

  /**
   * Simulate firing an onChange event
   */
  _handleChange = (selected) => {
    this.setState({ selected });

    this.props.onChange && this.props.onChange({
      target: {
        name: this.props.name,
        value: map(selected, 'id').join(','),
      },
    });
  };

  /**
   * Parse the batched response from the FB Graph API.
   */
  _handleGraphResponse = (response) => {
    if (!(response && isArray(response))) {
      return;
    }

    // The first item in the response is the full list of taggable friends.
    // The other items are friends who are already tagged,
    const options = JSON.parse(response.shift().body).data;
    const selected = [];

    response.forEach((data) => {
      if (data.code === 200) {
        selected.push(JSON.parse(data.body));
      }
    });

    this.setState({ options, selected });
  };
}

FBFriendTokenizer.propTypes = {
  // Comma-delimited string of FBIDs
  friends: PropTypes.string,
};

export default FBFriendTokenizer;
