import cx from 'classnames';
import { range } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import ConstrainedTextInput from './ConstrainedTextInput.react';
import HiddenInput from './HiddenInput.react';

import pad from '../../utils/pad';

const formatter = (value) => pad(value);

/**
 * DurationInput.react
 *
 * Input for specifying and displaying the duration of an activity, formatted
 * as `hh:mm:ss`.
 */
class DurationInput extends React.Component {
  static propTypes = {
    /**
     * The duration of the workout, in seconds.
     */
    duration: PropTypes.number,
    /**
     * Name of the form that is using the component.
     */
    name: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    duration: 0,
  };

  state = {
    duration: this.props.duration,
  };

  render() {
    const duration = moment.duration(this.props.duration, 's');

    return (
      <div className={cx('form-control', this.props.className)}>
        <ConstrainedTextInput
          maxLength={2}
          onChange={this._onChange}
          placeholder="hh"
          ref={(input) => this._hoursInput = input}
          value={this._getHoursValue(duration)}
          values={range(0, 100)}
        />
        :
        <ConstrainedTextInput
          format={formatter}
          maxLength={2}
          onChange={this._onChange}
          placeholder="mm"
          ref={(input) => this._minutesInput = input}
          value={duration.minutes()}
          values={range(0, 60)}
        />
        :
        <ConstrainedTextInput
          format={formatter}
          maxLength={2}
          onChange={this._onChange}
          placeholder="ss"
          ref={(input) => this._secondsInput = input}
          value={duration.seconds()}
          values={range(0, 60)}
        />
        <HiddenInput
          name={this.props.name}
          value={this.state.duration}
        />
      </div>
    );
  }

  _onChange = () => {
    const duration = moment.duration({
      hours: this._hoursInput.getValue(),
      minutes: this._minutesInput.getValue(),
      seconds: this._secondsInput.getValue(),
    }).asSeconds();

    // Update state to set the hidden input.
    this.setState({ duration });

    // Bubble a fake event to the parent component.
    this.props.onChange({
      target: {
        name: this.props.name,
        value: duration,
      },
    });
  };

  _getHoursValue = (duration) => /* ?number */ {
    if (duration) {
      return duration.days() * 24 + duration.hours();
    }
  };
}

export default DurationInput;
