import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';
import {FormControl} from 'react-bootstrap';

import AppForm from '../Forms/AppForm.react';
import DateTimePicker from '../DateTimePicker/DateTimePicker.react';
import Distance from '../Distance/Distance.react';
import DurationInput from '../Forms/DurationInput.react';
import FBFriendTokenizer from '../Facebook/FBFriendTokenizer.react';
import FormRow from '../Forms/FormGroup.react';
import ShoeSelector from '../Shoes/ShoeSelector.react';

import calculatePace from '../../utils/calculatePace';

import './css/ActivityForm.css';

const FIELDNAMES = {
  AVG_HR: 'avg_hr',
  DISTANCE: 'distance',
  DURATION: 'duration',
};

/**
 * ActivityForm.react
 *
 * Displays a form with inputs for adding or editing an activity.
 */
class ActivityForm extends React.Component {
  static displayName = 'ActivityForm';

  static propTypes = {
    /**
     * An existing activity object.
     */
    activity: PropTypes.object,
    errors: PropTypes.object,
    onChange: PropTypes.func.isRequired,
  };

  static defaultProps = {
    activity: {},
    errors: {},
  };

  componentDidMount() {
    // Auto-focus the distance field
    findDOMNode(this._distanceInput).focus();
  }

  render() {
    const {activity, errors} = this.props;
    const pace = calculatePace(
      activity.distance || 0,
      activity.duration || 0
    );

    return (
      <AppForm bordered className="activity-form" horizontal>
        <FormRow error={errors[FIELDNAMES.DISTANCE]} label="Distance">
          <FormControl
            className="distanceInput"
            defaultValue={activity[FIELDNAMES.DISTANCE]}
            name={FIELDNAMES.DISTANCE}
            onChange={this._onInputChange}
            ref={(input) => this._distanceInput = input}
            type="number"
          />
          <span className="colon">
            <Distance.Label />
          </span>
        </FormRow>

        <FormRow className="time" label="Duration">
          <DurationInput
            className="timeInput"
            duration={activity[FIELDNAMES.DURATION]}
            name={FIELDNAMES.DURATION}
            onChange={this._onInputChange}
          />
          <span className="colon">
            {pace} per <Distance.Label abbreviate />
          </span>
        </FormRow>

        <FormRow label="Date">
          <DateTimePicker
            date={activity.startDate}
            onChange={this._onDateChange}
            timezone={activity.timezone}
          />
        </FormRow>

        <FormRow error={errors[FIELDNAMES.AVG_HR]} label="Avg. Heart Rate">
          <FormControl
            className="heartRateInput"
            defaultValue={activity[FIELDNAMES.AVG_HR]}
            maxLength={3}
            name={FIELDNAMES.AVG_HR}
            onChange={this._onInputChange}
            type="text"
          />
          <span className="colon">bpm</span>
        </FormRow>

        <FormRow label="Shoes">
          <ShoeSelector
            name="shoe_id"
            onChange={this._onInputChange}
            value={activity.shoe_id}
          />
        </FormRow>

        <FormRow label="Friends">
          <FBFriendTokenizer
            friends={activity.friends}
            name="friends"
            onChange={this._onInputChange}
          />
        </FormRow>

        <FormRow label="Notes">
          <FormControl
            className="notes"
            componentClass="textarea"
            defaultValue={activity.notes}
            name="notes"
            onChange={this._onInputChange}
            placeholder="Add some details about your activity..."
            rows="6"
          />
        </FormRow>
      </AppForm>
    );
  }

  _onInputChange = (e) => {
    const {name, value} = e.target;
    const activity = {...this.props.activity};
    activity[name] = value;

    this._onChange(activity);
  };

  _onDateChange = (/*string*/ startDate, /*string*/ timezone) => {
    const activity = {
      ...this.props.activity,
      startDate,
      timezone,
    };

    this._onChange(activity);
  };

  _onChange = (activity) => {
    this.props.onChange(activity);
  };
}

export default ActivityForm;
