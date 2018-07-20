import {isEmpty} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {ControlLabel, FormControl, FormGroup, HelpBlock} from 'react-bootstrap';
import {connect} from 'react-redux';

import ActivityForm from './ActivityForm.react';
import AppForm from '../Forms/AppForm.react';
import EmptyState from '../EmptyState.react';
import Loader from '../Loader/Loader.react';

import {makeRequest} from '../../actions';
import ActionTypes from '../../constants/ActionTypes';

class ActivityFromUrlForm extends React.Component {
  state = {
    error: null,
  };

  render() {
    const {activity, onChange, isLoading} = this.props;
    const {error} = this.state;

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
        <FormGroup validationState={error ? 'error' : null}>
          <FormControl
            autoFocus
            onChange={this._handleUrlChange}
            placeholder="Enter a Garmin activity URL..."
            type="text"
          />
          {error && <HelpBlock>{error}</HelpBlock>}
        </FormGroup>
      </AppForm>
    );
    /* eslint-enable jsx-a11y/no-autofocus */
  }

  _handleUrlChange = (e) => {
    const url = e.target.value;

    if (!url) {
      this.setState({error: null});
      return;
    }

    // Extract the activity id and do some basic validation.
    const garminActivityId = parseInt(url.split('/').pop(), 10);
    if (!garminActivityId) {
      this.setState({error: 'Please enter a valid Garmin activity URL.'});
    } else {
      this.setState({error: null});
      this.props.getGarminActivity(garminActivityId);
    }
  };
}

ActivityFromUrlForm.propTypes = {
  activity: PropTypes.object,
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};

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
