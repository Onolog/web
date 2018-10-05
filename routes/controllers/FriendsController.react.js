import React from 'react';

import AppFullPage from '../../components/Page/AppFullPage.react';
import FBImage from '../../components/Facebook/FBImage.react';
import ImageBlock from '../../components/ImageBlock/ImageBlock.react';
import Link from '../../components/Link/Link.react';
import PageFrame from '../../components/Page/PageFrame.react';
import PageHeader from '../../components/Page/PageHeader.react';

/**
 * FriendsController
 */
class FriendsController extends React.Component {
  state = {
    friends: null,
  };

  componentDidMount() {
    // Get all friends who are in the system
    const {FB} = window;

    FB.getLoginStatus((res) => {
      FB.api('/me/friends', (res) => {
        this.setState({friends: res.data});
      });
    });
  }

  render() {
    return (
      <AppFullPage title="Friends">
        <PageHeader full title="Friends" />
        <PageFrame isLoading={!this.state.friends} scroll>
          {this._renderContent()}
        </PageFrame>
      </AppFullPage>
    );
  }

  _renderContent = () => {
    return this.state.friends ? this._renderFriendList() : null;
  }

  _renderFriendList = () => {
    return this.state.friends.map((friend, idx) => (
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
    ));
  }
}

export default FriendsController;
