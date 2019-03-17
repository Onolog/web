import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';

const TIMEZONES = moment.tz.names();

/**
 * TimezoneSelector.react
 */
const TimezoneSelector = ({ timezone, ...props }) => (
  <select {...props} value={timezone}>
    {TIMEZONES.map((zone) => (
      <option key={zone} value={zone}>
        {zone}
      </option>
    ))}
  </select>
);

TimezoneSelector.propTypes = {
  onChange: PropTypes.func,
  timezone: PropTypes.oneOf(TIMEZONES).isRequired,
};

export default TimezoneSelector;
