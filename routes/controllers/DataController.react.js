import {find, keys} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Panel} from 'react-bootstrap';
import {connect} from 'react-redux';

import AppPage from '../../components/Page/AppPage.react';
import Distance from '../../components/Distance/Distance.react';
import EmptyState from '../../components/EmptyState.react';
import Loader from '../../components/Loader/Loader.react';
import PageHeader from '../../components/Page/PageHeader.react';
import DataYearPanel from '../../components/Data/DataYearPanel.react';
import Topline from '../../components/Topline/Topline.react';

import {fetchUserData} from 'actions/users';
import {getAggregateDistance, groupActivities} from 'utils/ActivityUtils';

import {USER_DATA_FETCH} from 'constants/ActionTypes';

import './css/Data.scss';

const mapStateToProps = (state) => {
  const {activities, pendingRequests, shoes, session, users} = state;
  const user = find(users, {id: session.id});
  return {
    activities,
    pendingRequests,
    shoes,
    user,
  };
};

/**
 * DataController.react
 */
class DataController extends React.Component {
  static propTypes = {
    activities: PropTypes.arrayOf(PropTypes.object).isRequired,
    shoes: PropTypes.arrayOf(PropTypes.object).isRequired,
    user: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  };

  componentWillMount() {
    this.props.dispatch(fetchUserData());
  }

  render() {
    const {activities, pendingRequests, user} = this.props;

    if (!user || pendingRequests[USER_DATA_FETCH]) {
      return (
        <AppPage>
          <Loader />
        </AppPage>
      );
    }

    return (
      <AppPage className="profile" title="Your Activity">
        <PageHeader title={user.name} />
        {this._renderToplineStats(activities)}
        {this._renderContent(activities)}
      </AppPage>
    );
  }

  _renderToplineStats = (activities) => {
    const totalDistance = getAggregateDistance(activities);
    const totalRuns = activities.length;

    return (
      <Panel header={<h3>Lifetime Stats</h3>}>
        <Topline>
          <Topline.Item
            annotation={<Distance.Label />}
            label="Distance">
            <Distance distance={totalDistance} label={false} />
          </Topline.Item>
          <Topline.Item label="Activities">
            {totalRuns.toLocaleString()}
          </Topline.Item>
          <Topline.Item label="Shoes">
            {this.props.shoes.length}
          </Topline.Item>
        </Topline>
      </Panel>
    );
  };

  _renderContent = (activities) => {
    // Render an empty state when there's no data.
    if (!activities.length) {
      return (
        <Panel>
          <EmptyState>You have no activities. Get out there!</EmptyState>
        </Panel>
      );
    }

    const activitiesByYear = groupActivities.byYear(activities);
    const years = keys(activitiesByYear).reverse();

    return years.map((year) => {
      return (
        <DataYearPanel
          activities={activitiesByYear[year]}
          key={year}
          year={year}
        />
      );
    });
  };
}

module.exports = connect(mapStateToProps)(DataController);
