import cx from 'classnames';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';

import Distance from '../Distance/Distance.react';
import EmptyState from '../EmptyState.react';

import secondsToTime from '../../utils/secondsToTime';

import './css/ActivityFeed.scss';

const DATE_FORMAT = 'dddd, MMMM Do, YYYY';

const ActivityFeedItem = ({ activity, className }) => {
  const { distance, duration, startDate, timezone } = activity;

  return (
    <div className={cx('activity-feed-item')}>
      <div>{moment.tz(startDate, timezone).format(DATE_FORMAT)}</div>
      <div>
        <Distance distance={distance} label />
      </div>
      <div>{secondsToTime(duration)}</div>
    </div>
  );
};

const ActivityFeed = ({ activities, className }) => {
  if (!activities.length) {
    return (
      <EmptyState>
        No recent activities.
      </EmptyState>
    );
  }

  return (
    <div className={cx('activity-feed', className)}>
      {activities.map((a) => (
        <ActivityFeedItem
          activity={a}
          key={a.id}
        />
      ))}
    </div>
  );
};

ActivityFeed.propTypes = {
  activities: PropTypes.array.isRequired,
};

export default ActivityFeed;
