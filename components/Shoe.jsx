import {isEmpty} from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import {Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import AppPage from './Page/AppPage.react';
import Loader from './Loader/Loader.react';

import {makeRequest} from '../actions';
import secondsToTime from '../utils/secondsToTime';

class Shoe extends React.Component {
  componentWillMount() {
    const {fetchData, match: {params}, shoe} = this.props;

    if (isEmpty(shoe)) {
      fetchData(params.shoeId);
    }
  }

  render() {
    const {shoe} = this.props;

    if (isEmpty(shoe)) {
      return (
        <AppPage>
          <Loader />
        </AppPage>
      );
    }

    const {activities, name} = shoe;

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
      <AppPage>
        <h1>{name}</h1>
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
      </AppPage>
    );
  }
};

Shoe.propTypes = {
  shoe: PropTypes.shape({
    activities: PropTypes.shape({
      count: PropTypes.number.isRequired,
      sumDistance: PropTypes.number.isRequired,
    }).isRequired,
    id: PropTypes.number.isRequired,
    inactive: PropTypes.number.isRequired,
    model: PropTypes.string.isRequired,
  }),
};

const mapStateToProps = ({shoes}) => {
  const shoe = shoes.count && shoes.count === 1 && shoes.nodes[0];

  return {
    shoe: shoe || {},
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchData: (shoeId) => dispatch(makeRequest(`
    query shoes($shoeId: ID) {
      shoes(shoeId: $shoeId) {
        count,
        nodes {
          id,
          name,
          inactive,
          activities(shoeId: $shoeId) {
            count,
            sumDistance,
            nodes {
              distance,
              duration,
              id,
              startDate,
              timezone,
            }
          }
        }
      }
    }
  `, {shoeId}, 'SHOES_FETCH')),
});

export default connect(mapStateToProps, mapDispatchToProps)(Shoe);
