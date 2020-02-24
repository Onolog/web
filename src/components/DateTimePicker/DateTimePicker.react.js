import jstz from 'jstz';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';

import DateInput from './DateInput.react';
import TimeInput from './TimeInput.react';
import TimezoneSelector from '../Forms/TimezoneSelector.react';

import './DateTimePicker.scss';

// Make a best guess as to the user's current timezone.
const CURRENT_TIMEZONE = jstz.determine().name();
const TIMEZONES = moment.tz.names();

/**
 * DateTimePicker.react
 *
 * Form element that allows the user to select date, time and timezone.
 * Returns a date string with timezone offset and a timezone name.
 */
class DateTimePicker extends React.Component {
  static displayName = 'DateTimePicker';

  static propTypes = {
    /**
     * Some kind of date format. Could be:
     *
     *  - A JS Date object
     *  - A timestamp
     *  - An object with key/value pairs corresponding to year/month/day, etc.
     *  - String representation of a date.
     */
    date: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.number,
      PropTypes.object,
      PropTypes.string,
    ]),
    onChange: PropTypes.func.isRequired,
    /**
     * Timezone name (NOT the offset). For example: 'America/Los_Angeles'.
     */
    timezone: PropTypes.oneOf(TIMEZONES),
  };

  static defaultProps = {
    date: new Date(),
    timezone: CURRENT_TIMEZONE,
  };

  state = {
    // Convert the date to individual values to keep them separate from the
    // timezone/offset.
    dateObject: moment.tz(this.props.date, this.props.timezone).toObject(),
    timezone: this.props.timezone,
  };

  render() {
    const { dateObject, timezone } = this.state;

    return (
      <div className="DateTimePicker">
        <DateInput
          date={dateObject.date}
          months={dateObject.months}
          onChange={this._onChange}
          years={dateObject.years}
        />
        <TimeInput
          hours={dateObject.hours}
          minutes={dateObject.minutes}
          onChange={this._onChange}
        />
        <div className="TimezoneSelector">
          <TimezoneSelector
            className="TimezoneSelector-select"
            onChange={this._onTimezoneChange}
            timezone={timezone}
          />
        </div>
      </div>
    );
  }

  _onChange = (values) => {
    this.setState((state, props) => {
      const dateObject = { ...state.dateObject, ...values };

      props.onChange(
        moment.tz(dateObject, state.timezone).format(),
        state.timezone
      );

      return { dateObject };
    });
  };

  _onTimezoneChange = (e) => {
    const timezone = e.target.value;
    this.setState({ timezone });

    this.props.onChange(
      moment.tz(this.state.dateObject, timezone).format(),
      timezone
    );
  };
}

export default DateTimePicker;
