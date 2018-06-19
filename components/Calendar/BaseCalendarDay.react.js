import PropTypes from 'prop-types';
import React from 'react';

import cx from 'classnames';
import isSameDay from '../../utils/isSameDay';

/**
 * BaseCalendarDay.react
 *
 * Renders a single day for a month-view calendar
 */
class BaseCalendarDay extends React.Component {
  static displayName = 'BaseCalendarDay';

  static propTypes = {
    /**
     * Date object for the day being rendered
     */
    date: PropTypes.instanceOf(Date).isRequired,
    /**
     * Month being displayed by the calendar
     */
    month: PropTypes.number.isRequired,
  };

  render() {
    var dateObj = this.props.date;
    var month = dateObj.getMonth();
    var calMonth = this.props.month;
    var lastMonth = calMonth === 0 ? 11 : calMonth - 1;
    var nextMonth = calMonth === 11 ? 0 : calMonth + 1;

    return (
      <td
        className={cx({
          'lastMonth': month === lastMonth,
          'nextMonth': month === nextMonth,
          'today': isSameDay(dateObj, new Date()),
        })}>
        {this.props.children}
      </td>
    );
  }
}

module.exports = BaseCalendarDay;
