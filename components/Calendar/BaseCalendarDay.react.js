import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';

import cx from 'classnames';

/**
 * BaseCalendarDay.react
 *
 * Renders a single day for a month-view calendar
 */
const BaseCalendarDay = (props) => {
  const dateObj = props.date;
  const month = dateObj.getMonth();
  const calMonth = props.month;
  const lastMonth = calMonth === 0 ? 11 : calMonth - 1;
  const nextMonth = calMonth === 11 ? 0 : calMonth + 1;

  return (
    <td
      className={cx({
        lastMonth: month === lastMonth,
        nextMonth: month === nextMonth,
        today: moment().isSame(dateObj, 'day'),
      })}>
      {props.children}
    </td>
  );
};

BaseCalendarDay.propTypes = {
  /**
   * Date object for the day being rendered
   */
  date: PropTypes.instanceOf(Date).isRequired,
  /**
   * Month being displayed by the calendar
   */
  month: PropTypes.number.isRequired,
};

export default BaseCalendarDay;
