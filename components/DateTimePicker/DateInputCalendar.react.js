import cx from 'classnames';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import BaseCalendar from '../Calendar/BaseCalendar.react';
import BaseCalendarDay from '../Calendar/BaseCalendarDay.react';
import BaseCalendarWeek from '../Calendar/BaseCalendarWeek.react';
import Link from '../Link/Link.react';

import calendarGrid from '../../utils/calendarGrid';

/**
 * DateInputCalendar.react.js
 */
class DateInputCalendar extends React.Component {
  static displayName = 'DateInputCalendar';

  static propTypes = {
    /**
     * The month being displayed by the calendar.
     */
    month: PropTypes.number.isRequired,
    /**
     * The selected date for the DateInput component.
     */
    selectedDate: PropTypes.instanceOf(Date).isRequired,
    /**
     * The year being displayed by the calendar.
     */
    year: PropTypes.number.isRequired,
  };

  render() {
    const grid = calendarGrid(this.props.month, this.props.year);

    return (
      <BaseCalendar
        className="DateInputCalendar"
        headerFormat="dd">
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
    const dayDate = day.date;
    return (
      <BaseCalendarDay
        date={dayDate}
        key={idx}
        month={this.props.month}>
        <Link
          className={cx({
            'selected': moment(dayDate).isSame(this.props.selectedDate, 'day'),
          })}
          href="#"
          onClick={this._onDayClick.bind(this, dayDate)}>
          {dayDate.getDate()}
        </Link>
      </BaseCalendarDay>
    );
  };

  _onDayClick = (/*Date*/ selectedDate, e) => {
    e.preventDefault();
    this.props.onChange && this.props.onChange({
      date: selectedDate.getDate(),
      months: selectedDate.getMonth(),
      years: selectedDate.getFullYear(),
    });
  };
}

export default DateInputCalendar;
