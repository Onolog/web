import PropTypes from 'prop-types';
import React from 'react';

/**
 * CalendarDate.react
 *
 * Renders the date in a single calendar cell.
 */
class CalendarDate extends React.Component {
  static displayName = 'CalendarDate';

  static propTypes = {
    /**
     * Date object for the day being rendered
     */
    date: PropTypes.instanceOf(Date).isRequired,
  };

  render() {
    return (
      <h3>{this.props.date.getDate()}</h3>
    );
  }
}

module.exports = CalendarDate;
