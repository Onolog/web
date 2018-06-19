import jstz from 'jstz';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';

import ActivityCalendarDay from './ActivityCalendarDay.react';
import BaseCalendar from '../Calendar/BaseCalendar.react';
import BaseCalendarWeek from '../Calendar/BaseCalendarWeek.react';

import calendarGrid from '../../utils/calendarGrid';

const CURRENT_TIMEZONE = jstz.determine().name();

import './css/ActivityCalendar.css';

/**
 * ActivityCalendar.react
 */
class ActivityCalendar extends React.Component {
  render() {
    const {date} = this.props;
    const grid = calendarGrid(date.getMonth(), date.getFullYear());

    return (
      <BaseCalendar className="calendar">
        {grid.map(this._renderWeek)}
      </BaseCalendar>
    );
  }

  _renderWeek = (week, idx) => {
    this._weeklyMileage = 0;
    return (
      <BaseCalendarWeek key={idx}>
        {week.map(this._renderDay)}
      </BaseCalendarWeek>
    );
  };

  _renderDay = (day, idx) => {
    const dateObject = day.date;
    const dayMoment = moment.tz(dateObject, CURRENT_TIMEZONE);
    const activities = this.props.activities.filter((activity) => {
      const activityMoment = moment.tz(activity.startDate, activity.timezone);

      // Don't use moment.isSame() here, since it won't always work correctly
      // for moments across timezones.
      return (
        dayMoment.year() === activityMoment.year() &&
        dayMoment.month() === activityMoment.month() &&
        dayMoment.date() === activityMoment.date()
      );
    });

    if (activities.length) {
      activities.forEach((activity) => {
        this._weeklyMileage += +activity.distance;
      });
    }

    return (
      <ActivityCalendarDay
        activities={activities}
        date={dateObject}
        key={idx}
        month={this.props.date.getMonth()}
        weeklyMileage={this._weeklyMileage}
      />
    );
  };
}

ActivityCalendar.propTypes = {
  activities: PropTypes.array.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
};

export default ActivityCalendar;
