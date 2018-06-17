import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import {Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {makeRequest} from '../actions';
import secondsToTime from '../utils/secondsToTime';

class Activities extends React.Component {
  componentWillMount() {
    this.props.fetchData(this.props.session.user.id);
  }

  render() {
    const {activities} = this.props;

    if (activities.nodes == null) {
      return <div>Loading...</div>;
    }

    const content = activities.count === 0 ?
      <tr colSpan="3">
        <td>You don't have any activities!</td>
      </tr> :
      <tbody>
        {activities.nodes.map(({distance, duration, id, startDate, timezone}) => (
          <tr key={id}>
            <td>
              <Link to={`/activities/${id}`}>
                {moment.tz(startDate, timezone).format('dddd, MMMM Do YYYY')}
              </Link>
            </td>
            <td>{distance} miles</td>
            <td>{secondsToTime(duration)}</td>
          </tr>
        ))}
      </tbody>;

    return (
      <div>
        <h1>Activities</h1>
        <ul className="list-inline">
          <li>Activities: {activities.count}</li>
          <li>Total Mileage: {activities.sumDistance}</li>
        </ul>
        <Table bordered>
          <thead>
            <tr>
              <th>Date</th>
              <th>Distance</th>
              <th>Duration</th>
            </tr>
          </thead>
          {content}
        </Table>
      </div>
    );
  }
};

Activities.propTypes = {
  activities: PropTypes.shape({
    count: PropTypes.number,
    sumDistance: PropTypes.number,
    nodes: PropTypes.arrayOf(PropTypes.shape({
      distance: PropTypes.string.isRequired,
      duration: PropTypes.number.isRequired,
      id: PropTypes.number.isRequired,
      startDate: PropTypes.string.isRequired,
      timezone: PropTypes.string.isRequired,
    })),
  }).isRequired,
};

const mapStateToProps = ({activities, session, user}) => ({
  activities,
  session,
  user,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (userId) => dispatch(makeRequest(`
    query activities($userId: ID) {
      activities(userId: $userId, limit: 50) {
        count,
        sumDistance,
        nodes {
          distance,
          duration,
          id,
          startDate,
          timezone,
        }
      },
    }
  `, {userId}, 'ACTIVITIES_FETCH')),
});

export default connect(mapStateToProps, mapDispatchToProps)(Activities);
