import cx from 'classnames';
import {isEmpty} from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {Col, Row, Tab, Tabs} from 'react-bootstrap';
import {findDOMNode} from 'react-dom';
import {connect} from 'react-redux';

import ActivityFeed from '../../components/Activities/ActivityFeed.react';
import AppFullPage from '../../components/Page/AppFullPage.react';
import Distance from '../../components/Distance/Distance.react';
import FBImage from '../../components/Facebook/FBImage.react';
import Loader from '../../components/Loader/Loader.react';
import MaterialIcon from '../../components/Icons/MaterialIcon.react';
import NavbarToggle from '../../components/Navigation/NavbarToggle.react';
import PageFrame from '../../components/Page/PageFrame.react';
import PageHeader from '../../components/Page/PageHeader.react';
import Topline from '../../components/Topline/Topline.react';

import {makeRequest, toggleSideNav} from '../../actions';
import isBrowser from '../../utils/isBrowser';

import ActionTypes from '../../constants/ActionTypes';

import './css/Profile.scss';

const SummaryShape = PropTypes.shape({
  count: PropTypes.number,
  sumDistance: PropTypes.number,
});

const ProfileDetails = ({user}) => {
  const userLocation = user.location ?
    <li>
      <MaterialIcon icon="map-marker" />
      {user.location}
    </li> :
    null;

  return (
    <ul className="profile-details">
      {userLocation}
      <li>
        <MaterialIcon icon="calendar" />
        Joined {moment(user.createdAt).format('MMMM YYYY')}
      </li>
    </ul>
  );
};

/**
 * ProfileController.react
 */
class ProfileController extends React.Component {
  state = {
    showHeader: false,
  }

  componentWillMount() {
    this.props.fetchData(this.props.match.params.userId);

    if (isBrowser()) {
      window.addEventListener('scroll', this._showHeaderCheck, true);
    }
  }

  componentWillReceiveProps({match: {params}}) {
    // Re-fetch data when navigating to a different profile.
    if (this.props.match.params.userId !== params.userId) {
      this.props.fetchData(params.userId);
    }
  }

  componentWillUnmount() {
    if (isBrowser()) {
      window.removeEventListener('scroll', this._showHeaderCheck, true);
    }
  }

  _showHeaderCheck = () => {
    const node = findDOMNode(this._profileImageName);
    const {bottom} = node.getBoundingClientRect();
    const showHeader = bottom <= 0;

    if (showHeader !== this.state.showHeader) {
      this.setState({showHeader});
    }
  }

  render() {
    const {user} = this.props;

    return (
      <AppFullPage className="profile" title={user && user.name}>
        {this._renderContents()}
      </AppFullPage>
    );
  }

  _renderContents = () => {
    const {
      activities,
      pendingRequests,
      user,
    } = this.props;

    if (isEmpty(user) || pendingRequests[ActionTypes.USER_FETCH]) {
      return <Loader background full />;
    }

    return (
      <PageFrame fill scroll>
        <PageHeader
          className={cx('profile-header', {
            'profile-header-fixed': this.state.showHeader,
          })}
          full
          title={user.name || ''}
        />
        <div className="profile-cover">
          <NavbarToggle
            className="visible-xs-block"
            onClick={this.props.toggleSideNav}
          />
        </div>
        <Row className="profile-content">
          <Col className="profile-info-col" sm={3}>

            <div
              className="profile-image-name-container"
              ref={(r) => this._profileImageName = r}>
              <div className="profile-image">
                <FBImage fbid={user.id} height={180} width={180} />
              </div>
              <h2 className="profile-name">
                {user.name}
              </h2>
            </div>
            <ProfileDetails user={user} />
          </Col>
          <Col className="profile-main-col" sm={9}>
            <Row>
              <Col lg={8}>
                <ActivityFeed activities={activities} />
              </Col>
              <Col lg={4}>
                {this._renderActivitySummary()}
                {/*<h4>Friends</h4>*/}
              </Col>
            </Row>
          </Col>
        </Row>
      </PageFrame>
    );
  };

  _renderActivitySummary = () => {
    const {month, week, year} = this.props.activitySummary;

    if (!month || !week || !year) {
      return;
    }

    const tabs = [
      {data: week, title: 'This Week'},
      {data: month, title: 'This Month'},
      {data: year, title: 'This Year'},
    ];

    return (
      <Tabs
        animation={false}
        bsStyle="pills"
        className="activity-summary"
        id="activity-summary"
        justified>
        {tabs.map(({data, title}, idx) => (
          <Tab eventKey={idx + 1} key={title} title={title}>
            <Topline>
              <Topline.Item annotation={<Distance.Label />} label="Distance">
                <Distance distance={data.sumDistance} label={false} />
              </Topline.Item>
              <Topline.Item label="Activities">
                {data.count}
              </Topline.Item>
            </Topline>
          </Tab>
        ))}
      </Tabs>
    );
  }
}

ProfileController.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    distance: PropTypes.string,
    duration: PropTypes.number,
    startDate: PropTypes.string,
    timezone: PropTypes.string,
  })).isRequired,
  activitySummary: PropTypes.shape({
    month: SummaryShape,
    week: SummaryShape,
    year: SummaryShape,
  }).isRequired,
  pendingRequests: PropTypes.object.isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    createdAt: PropTypes.string,
    location: PropTypes.string,
    name: PropTypes.string,
  }),
};

const mapStateToProps = ({pendingRequests, user}) => {
  const {activities, activitySummary} = user;

  return {
    activities: (activities && activities.nodes) || [],
    activitySummary: activitySummary || {},
    pendingRequests,
    user,
  };
};

const summaryFields = `
  count,
  sumDistance,
`;

const mapDispatchToProps = (dispatch) => ({
  fetchData: (userId) => dispatch(makeRequest(`
    query user($userId: ID!) {
      user(id: $userId) {
        id,
        createdAt,
        location,
        name,
        activitySummary(userId: $userId) {
          week {
            ${summaryFields}
          },
          month {
            ${summaryFields}
          },
          year {
            ${summaryFields}
          },
        },
        activities(userId: $userId, limit: 20) {
          ${summaryFields}
          nodes {
            id,
            distance,
            duration,
            startDate,
            timezone,
          },
        },
      },
    }
  `, {userId}, ActionTypes.USER_FETCH)),
  toggleSideNav: () => dispatch(toggleSideNav()),
});

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileController);
