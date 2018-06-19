import {Panel} from 'react-bootstrap';
import React from 'react';

import AppPage from '../../components/Page/AppPage.react';
import FBImage from '../../components/Facebook/FBImage.react';
import ImageBlock from '../../components/ImageBlock/ImageBlock.react';
import Link from '../../components/Link/Link.react';
import Loader from '../../components/Loader/Loader.react';
import PageHeader from '../../components/Page/PageHeader.react';

import fbLoader from 'utils/fbLoader';

/**
 * Friends.react
 */
class Friends extends React.Component {
  static displayName = 'Friends';

  state = {
    friends: null,
  };

  componentWillMount() {
    // Get all friends who are in the system
    fbLoader(this._getFriends);
  }

  render() {
    return (
      <AppPage narrow title="Friends">
        <PageHeader title="Friends" />
        <Panel>
          {this._renderContent()}
        </Panel>
      </AppPage>
    );
  }

  _renderContent = () => {
    return this.state.friends ? this._renderFriendList() : <Loader />;
  };

  _renderFriendList = () => {
    return this.state.friends.map(function(friend, idx) {
      return (
        <ImageBlock
          align="middle"
          image={
            <Link
              className="innerBorder"
              href={`/users/${friend.id}`}>
              <FBImage fbid={friend.id} />
            </Link>
          }
          key={idx}>
          <h4>{friend.name}</h4>
        </ImageBlock>
      );
    });
  };

  _getFriends = () => {
    const {FB} = window;
    FB.getLoginStatus((response) => {
      FB.api('/me/friends', (response) => {
        this.setState({friends: response.data});
      });
    });
  };
}

module.exports = Friends;
