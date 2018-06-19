import {find} from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import AppPage from './Page/AppPage.react';
import Loader from './Loader/Loader.react';

import {makeRequest} from '../actions';

class Activity extends React.Component {
  componentWillMount() {
    const {fetchData, match: {params}, activity} = this.props;

    if (!activity) {
      fetchData(params.id);
    }
  }

  render() {
    const {activity} = this.props;

    if (!activity) {
      return (
        <AppPage>
          <Loader />
        </AppPage>
      );
    }

    const {startDate, timezone} = activity;

    return (
      <AppPage>
        <h1>{moment.tz(startDate, timezone).format('dddd, MMMM Do YYYY')}</h1>
      </AppPage>
    );
  }
};

Activity.propTypes = {
  activity: PropTypes.shape({
    distance: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = ({activities}, {match: {params}}) => {
  let activity;
  if (activities.count && activities.count === 1) {
    const id = parseInt(params.id, 10);
    activity = find(activities.nodes, {id})
  }
  return {activity};
};

const mapDispatchToProps = (dispatch) => ({
  fetchData: (activityId) => dispatch(makeRequest(`
    query activities($activityId: ID) {
      activities(activityId: $activityId) {
        count,
        nodes {
          id,
          startDate,
          distance,
          timezone,
        }
      }
    }
  `, {activityId}, 'ACTIVITIES_FETCH')),
});

export default connect(mapStateToProps, mapDispatchToProps)(Activity);
