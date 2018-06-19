import PropTypes from 'prop-types';
import React from 'react';

import BaseCalendar from './BaseCalendar.react';
import BaseCalendarDay from './BaseCalendarDay.react';
import BaseCalendarWeek from './BaseCalendarWeek.react';
import CalendarDate from './CalendarDate.react';

import calendarGrid from '../../utils/calendarGrid';

/**
 * Renders a calendar view for a single month
 */
class Calendar extends React.Component {
  static displayName = 'Calendar';

  static propTypes = {
    date: PropTypes.instanceOf(Date).isRequired,
  };

  render() {
    const grid = calendarGrid(
      this.props.date.getMonth(),
      this.props.date.getFullYear()
    );

    return (
      <BaseCalendar className="calendar">
        {grid.map(this._renderWeek)}
      </BaseCalendar>
    );
  }

  _renderWeek = (week, idx) => {
    return (
      <BaseCalendarWeek key={idx}>
        {week.map(this._renderDay)}
      </BaseCalendarWeek>
    );
  };

  _renderDay = (day, idx) => {
    const date = day.date;
    return (
      <BaseCalendarDay
        date={date}
        key={idx}
        month={this.props.date.getMonth()}>
        <CalendarDate date={date} />
      </BaseCalendarDay>
    );
  };
}

export default Calendar;
