import PropTypes from 'prop-types';
import React from 'react';

/**
 * CalendarDate.react
 *
 * Renders the date in a single calendar cell.
 */
const CalendarDate = ({ date }) => <h3>{date.getDate()}</h3>;

CalendarDate.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,
};

export default CalendarDate;
