import {isEmpty} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {ControlLabel, FormControl, FormGroup} from 'react-bootstrap';
import {connect} from 'react-redux';

import ActivityForm from './ActivityForm.react';
import AppForm from '../Forms/AppForm.react';
import EmptyState from '../EmptyState.react';
import Loader from '../Loader/Loader.react';

import {makeRequest} from '../../actions';
import ActionTypes from '../../constants/ActionTypes';

class ActivityFromUrlForm extends React.Component {
  static propTypes = {
    activity: PropTypes.object,
    isLoading: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
  };

  render() {
    const {activity, onChange, isLoading} = this.props;

    if (!isEmpty(activity)) {
      return (
        <ActivityForm
          activity={activity}
          onChange={onChange}
        />
      );
    }

    if (isLoading) {
      return (
        <EmptyState>
          <Loader background full />
        </EmptyState>
      );
    }

    /* eslint-disable jsx-a11y/no-autofocus */
    return (
      <AppForm>
        <FormGroup>
          <ControlLabel>
            Enter a Garmin Activity URL
          </ControlLabel>
          <FormControl
            autoFocus
            onChange={this._handleUrlChange}
            type="text"
          />
        </FormGroup>
      </AppForm>
    );
    /* eslint-enable jsx-a11y/no-autofocus */
  }

  _handleUrlChange = (e) => {
    const url = e.target.value;

    if (!url) {
      return;
    }

    // Extract the activity id and do some basic validation.
    const garminActivityId = parseInt(url.split('/').pop(), 10);
    if (!garminActivityId) {
      alert('Invalid url');
      return;
    }

    this.props.getGarminActivity(garminActivityId);
  };
}

const mapDispatchToProps = (dispatch) => ({
  getGarminActivity: (garminActivityId) => dispatch(makeRequest(`
    query garminActivity($garminActivityId: ID!) {
      garminActivity(garminActivityId: $garminActivityId) {
        activityType,
        calories,
        distance,
        duration,
        garminActivityId,
        avgHr,
        maxHr,
        elevationGain,
        elevationLoss,
        startDate,
        timezone,
      }
    }
  `, {garminActivityId}, ActionTypes.GARMIN_ACTIVITY_FETCH)),
});

export default connect(null, mapDispatchToProps)(ActivityFromUrlForm);
