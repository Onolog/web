import {keys} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Panel} from 'react-bootstrap';
import {connect} from 'react-redux';

import AppFullPage from '../../components/Page/AppFullPage.react';
import Distance from '../../components/Distance/Distance.react';
import EmptyState from '../../components/EmptyState.react';
import PageFrame from '../../components/Page/PageFrame.react';
import PageHeader from '../../components/Page/PageHeader.react';
import DataYearPanel from '../../components/Data/DataYearPanel.react';
import Topline from '../../components/Topline/Topline.react';

import {makeRequest} from '../../actions';
import {groupActivities} from '../../utils/ActivityUtils';

import ActionTypes from '../../constants/ActionTypes';

import './styles/Data.scss';

/**
 * DataController.react
 */
class DataController extends React.Component {
  componentWillMount() {
    this.props.fetchData(this.props.session.user.id);
  }

  render() {
    const {activities, pendingRequests, user} = this.props;

    if (
      !user.name ||
      !activities.count ||
      pendingRequests[ActionTypes.USER_FETCH]
    ) {
      return (
        <AppFullPage>
          <PageFrame isLoading />
        </AppFullPage>
      );
    }

    return (
      <AppFullPage className="profile" title="Your Activity">
        <PageHeader full title={user.name} />
        <PageFrame scroll>
          {this._renderToplineStats()}
          {this._renderContent()}
        </PageFrame>
      </AppFullPage>
    );
  }

  _renderToplineStats = () => {
    const {count, sumDistance} = this.props.activities;

    return (
      <Panel>
        <Panel.Heading>
          <Panel.Title>Lifetime Stats</Panel.Title>
        </Panel.Heading>
        <Panel.Body>
          <Topline>
            <Topline.Item
              annotation={<Distance.Label />}
              label="Distance">
              <Distance distance={sumDistance} label={false} />
            </Topline.Item>
            <Topline.Item label="Activities">
              {count.toLocaleString()}
            </Topline.Item>
            <Topline.Item label="Shoes">
              {this.props.shoes.count}
            </Topline.Item>
          </Topline>
        </Panel.Body>
      </Panel>
    );
  };

  _renderContent = () => {
    const {activities} = this.props;

    // Render an empty state when there's no data.
    if (!activities.count) {
      return (
        <Panel>
          <EmptyState>You have no activities. Get out there!</EmptyState>
        </Panel>
      );
    }

    const activitiesByYear = groupActivities.byYear(activities.nodes);
    const years = keys(activitiesByYear).reverse();

    return years.map((year) => {
      return (
        <DataYearPanel
          activities={activitiesByYear[year]}
          key={year}
          year={+year}
        />
      );
    });
  };
}

DataController.propTypes = {
  activities: PropTypes.shape({
    count: PropTypes.number,
    nodes: PropTypes.arrayOf(PropTypes.object),
    sumDistance: PropTypes.number,
  }),
  shoes: PropTypes.shape({
    count: PropTypes.number,
  }),
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
};

const mapStateToProps = (state) => {
  const {activities, pendingRequests, shoes, session, user} = state;
  return {
    activities,
    pendingRequests,
    session,
    shoes,
    user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchData: (userId) => dispatch(makeRequest(`
    query user($userId: ID!) {
      user(id: $userId) {
        id,
        name,
        activities {
          count,
          sumDistance,
          nodes {
            distance,
            duration,
            id,
            startDate,
            timezone
          }
        }
        shoes {
          count,
        }
      }
    }
  `, {userId}, ActionTypes.USER_FETCH)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DataController);
