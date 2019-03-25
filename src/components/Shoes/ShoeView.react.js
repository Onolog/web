import { sortBy } from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'react-bootstrap';

import ActivitySection from '../Activities/ActivitySection.react';
import Distance from '../Distance/Distance.react';
import EmptyState from '../EmptyState.react';
import Loader from '../Loader/Loader.react';
import Topline from '../Topline/Topline.react';

import secondsToTime from '../../utils/secondsToTime';

/**
 * ShoeView.react
 *
 * Data (mileage, total activities, and activity summary) for a single shoe.
 */
class ShoeView extends React.Component {
  render() {
    const { shoe } = this.props;

    const sizeItem = shoe.size ?
      <Topline.Item label="Size">
        {shoe.size}
      </Topline.Item> :
      null;

    return (
      <div className="shoeView">
        <ActivitySection>
          <Topline>
            <Topline.Item
              annotation={<Distance.Label />}
              label="Distance">
              <Distance distance={shoe.activities.sumDistance} label={false} />
            </Topline.Item>
            <Topline.Item label="Activities">
              {shoe.activities.count}
            </Topline.Item>
            {sizeItem}
          </Topline>
        </ActivitySection>
        {this._renderNotes(shoe.notes)}
        {this._renderActivities()}
      </div>
    );
  }

  _renderNotes = (notes) => {
    if (notes) {
      return (
        <ActivitySection title="Notes">
          {notes}
        </ActivitySection>
      );
    }
  };

  _renderActivities = () => {
    const { activities, isLoading } = this.props;

    if (isLoading) {
      return (
        <EmptyState>
          <Loader background full large />
        </EmptyState>
      );
    }

    if (!activities.length) {
      return <EmptyState>No activities to display.</EmptyState>;
    }

    return (
      <Table hover>
        <thead>
          <tr>
            <th>Activity Date</th>
            <th className="mileage">
              <Distance.Label />
            </th>
            <th className="time">Duration</th>
          </tr>
        </thead>
        <tbody>
          {sortBy(activities, 'startDate')
            .reverse()
            .map(this._renderRows)}
        </tbody>
      </Table>
    );
  };

  _renderRows = (activity) => {
    const date = moment.tz(
      activity.startDate,
      activity.timezone
    ).format('MM/DD/YY');

    return (
      <tr key={activity.id}>
        <td>
          {date}
        </td>
        <td className="mileage">
          <Distance
            distance={activity.distance}
            label={false}
          />
        </td>
        <td className="time">
          {secondsToTime(activity.duration)}
        </td>
      </tr>
    );
  };
}

ShoeView.propTypes = {
  /**
   * Array of all the activities associated with the shoe
   */
  activities: PropTypes.arrayOf(PropTypes.shape({
    distance: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
    id: PropTypes.number.isRequired,
    startDate: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
  }).isRequired),
  isLoading: PropTypes.bool,
  shoe: PropTypes.shape({
    activities: PropTypes.shape({
      count: PropTypes.number,
      sumDistance: PropTypes.number,
    }),
    notes: PropTypes.string,
    size: PropTypes.string,
    sizeType: PropTypes.number,
  }).isRequired,
};

ShoeView.defaultProps = {
  activities: [],
  isLoading: false,
};

export default ShoeView;
