import {find, isEmpty, meanBy} from 'lodash';
import moment from 'moment-timezone';
import {Button, ButtonGroup, OverlayTrigger, Tooltip} from 'react-bootstrap';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Activity from '../../components/Activities/Activity.react';
import ActivityChart from '../../components/Data/ActivityChart.react';
import ActivityModal from '../../components/Activities/ActivityModal.react';
import ActivitySection from '../../components/Activities/ActivitySection.react';
import AppFullPage from '../../components/Page/AppFullPage.react';
import Loader from '../../components/Loader/Loader.react';
import MaterialIcon from '../../components/Icons/MaterialIcon.react';
import PageFrame from '../../components/Page/PageFrame.react';
import PageHeader from '../../components/Page/PageHeader.react';

import {makeRequest} from '../../actions';
import {metersToFeet, metersToMiles} from '../../utils/distanceUtils';
import getParam from '../../utils/getParam';
import getHomePath from '../../utils/getHomePath';
import speedToPace from '../../utils/speedToPace';

import ActionTypes from '../../constants/ActionTypes';
import {METRICS} from '../../constants/Garmin';

const DATE_FORMAT = 'dddd, MMMM Do, YYYY';

const convertActivityMetrics = (activityMetrics) => {
  const meanPace = meanBy(activityMetrics, (metrics) => {
    if (metrics[METRICS.SPEED]) {
      return speedToPace(metrics[METRICS.SPEED]);
    }
  });

  return activityMetrics.reduce((converted, metrics, idx, metricsArr) => {
    const lat = metrics[METRICS.LATITUDE];
    const lng = metrics[METRICS.LONGITUDE];

    if (lat && lng) {
      // Normalize & compress outlying data.
      // TODO: Don't modify the data, change the bounds of the chart.
      const paceThreshold = Math.pow(meanPace, 2) / 400;
      const pace = speedToPace(metrics[METRICS.SPEED]);

      converted.push({
        distance: metersToMiles(metrics[METRICS.SUM_DISTANCE]),
        elevation: metersToFeet(metrics[METRICS.ELEVATION]),
        hr: metrics[METRICS.HEART_RATE] || 0,
        lat,
        lng,
        pace: !pace || pace > paceThreshold ? paceThreshold : pace,
      });
    }

    return converted;
  }, []);
};

/**
 * ActivityController.react
 *
 * Displays a single activity.
 */
class ActivityController extends React.Component {
  state = {
    showModal: false,
  };

  componentWillMount() {
    this.props.fetchData(getParam(this.props, 'activityId'));
  }

  componentWillReceiveProps(nextProps) {
    const {pendingRequests} = this.props;

    if (
      pendingRequests[ActionTypes.ACTIVITY_UPDATE] &&
      !nextProps.pendingRequests[ActionTypes.ACTIVITY_UPDATE]
    ) {
      this.setState({showModal: false});
    }

    // Redirect if the activity was deleted.
    if (pendingRequests[ActionTypes.ACTIVITY_DELETE] && !nextProps.activity) {
      this.props.history.push(getHomePath());
      return;
    }
  }

  render() {
    const {activity, pendingRequests} = this.props;

    if (isEmpty(activity) || pendingRequests[ActionTypes.ACTIVITIES_FETCH]) {
      return (
        <AppFullPage>
          <Loader background full />
        </AppFullPage>
      );
    }

    const activityDate = moment.tz(
      activity.startDate,
      activity.timezone
    ).format(DATE_FORMAT);

    return (
      <AppFullPage title={activityDate}>
        <PageHeader full title={activityDate}>
          {this._renderButtonGroup()}
        </PageHeader>
        <PageFrame fill scroll>
          <Activity
            activity={activity}
            athlete={activity.user}
            fill
            shoe={activity.shoe}
          />
          {this._renderActivityMetrics()}
        </PageFrame>
      </AppFullPage>
    );
  }

  _renderButtonGroup = () => {
    const {activity, canEdit} = this.props;
    const {showModal} = this.state;

    if (canEdit) {
      return (
        <ButtonGroup bsSize="small">
          <OverlayTrigger
            overlay={<Tooltip id="edit">Edit Activity</Tooltip>}
            placement="bottom">
            <Button onClick={this._handleActivityEdit}>
              <MaterialIcon icon="pencil" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            overlay={<Tooltip id="delete">Delete Activity</Tooltip>}
            placement="bottom">
            <Button onClick={this._handleActivityDelete}>
              <MaterialIcon icon="delete" />
            </Button>
          </OverlayTrigger>
          <ActivityModal
            initialActivity={activity}
            onHide={() => this.setState({showModal: false})}
            show={showModal}
          />
        </ButtonGroup>
      );
    }
  };

  _renderActivityMetrics = () => {
    const {details} = this.props.activity;

    if (!(details && details.length)) {
      return null;
    }

    return (
      <ActivitySection border title="Data">
        <ActivityChart data={convertActivityMetrics(details)} />
      </ActivitySection>
    );
  };

  _handleActivityDelete = () => {
    if (confirm('Are you sure you want to delete this activity?')) {
      this.props.deleteActivity(this.props.activity.id);
    }
  };

  _handleActivityEdit = () => {
    this.setState({showModal: true});
  };
}

ActivityController.propTypes = {
  activity: PropTypes.object,
  canEdit: PropTypes.bool.isRequired,
  pendingRequests: PropTypes.object.isRequired,
};

const mapStateToProps = ({activities, pendingRequests, session}, props) => {
  const nodes = (activities && activities.nodes) || [];
  const activity = find(nodes, {id: +getParam(props, 'activityId')}) || {};
  const user = activity.user || {};

  return {
    activity,
    canEdit: session.user.id === user.id,
    pendingRequests,
  };
};

const mapDispatchToProps = (dispatch) => ({
  deleteActivity: (activityId) => dispatch(makeRequest(`
    mutation deleteActivity($activityId: ID!) {
      deleteActivity(id: $activityId)
    }
  `, {activityId}, ActionTypes.ACTIVITY_DELETE)),
  fetchData: (activityId) => dispatch(makeRequest(`
    query activities($activityId: ID) {
      activities(id: $activityId) {
        count,
        sumDistance,
        nodes {
          avgHr,
          calories,
          distance,
          duration,
          elevationGain,
          elevationLoss,
          friends,
          id,
          maxHr,
          notes,
          startDate,
          timezone,
          details {
            directCorrectedElevation,
            directElevation,
            directHeartRate,
            directLatitude,
            directLongitude,
            directSpeed,
            directTimestamp,
            directUncorrectedElevation,
            directVerticalSpeed,
            sumDistance,
            sumDuration,
            sumElapsedDuration,
            sumMovingDuration,
          },
          shoeId,
          shoe {
            id,
            name,
          },
          user {
            id,
            name,
          }
        }
      },
    }
  `, {activityId}, ActionTypes.ACTIVITIES_FETCH)),
});

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(ActivityController);
