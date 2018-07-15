import jstz from 'jstz';
import {isEmpty, isEqual, isInteger, pick} from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {makeRequest, hideActivityModal} from '../actions';
import ActionTypes from '../constants/ActionTypes';

const WHITELISTED_FIELDS = [
  'activityType',
  'distance',
  'duration',
  'avgHr',
  'maxHr',
  'calories',
  'elevationGain',
  'elevationLoss',
  'friends',
  'garminActivityId',
  'notes',
  'shoeId',
  'startDate',
  'timezone',
  'userId',
];

const getInitialState = (props) => ({
  activity: props.initialActivity || getNewActivity(props),
  errors: {},
  isLoading: false,
});

const getNewActivity = (props) => {
  const date = props.date || new Date();
  const now = new Date();

  // Set time to match the current time.
  date.setHours(
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  );

  return {
    startDate: moment(date).format(),
    timezone: jstz.determine().name(), // Guess the user's timezone
  };
};

const FIELDS = {
  distance: {
    error: 'Please enter a valid distance greater than 0.',
    isValid: (value) => !!Number(value),
  },
  'avgHr': {
    error: 'Please enter a valid heart rate.',
    isValid: (value) => !value || isInteger(Number(value)),
  },
};

/**
 * ActivityWriteContainer
 *
 * Abstracts functionality for creating, editing, or deleting an activity.
 */
const activityModalContainer = (Component) => {
  class WrappedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = getInitialState(props);
    }

    componentWillReceiveProps(nextProps) {
      const {garminActivity, date} = nextProps;

      if (!isEmpty(garminActivity)) {
        this.setState({activity: garminActivity});
        return;
      }

      if (
        this.props.date && date &&
        this.props.date.getTime() !== date.getTime()
      ) {
        this.setState({activity: getNewActivity(nextProps)});
      }
    }

    render() {
      const {initialActivity, ...props} = this.props;
      return (
        <Component
          {...props}
          {...this.state}
          isEditing={!!initialActivity}
          onChange={this._handleChange}
          onDelete={this._handleDelete}
          onExited={this._handleExited}
          onHide={this._handleHide}
          onSave={this._handleSave}
        />
      );
    }

    _handleChange = (activity) => {
      this.setState({activity});
    }

    _handleDelete = () => {
      const {initialActivity, deleteActivity} = this.props;
      if (confirm('Are you sure you want to delete this activity?')) {
        this.setState({isLoading: true});
        deleteActivity(initialActivity.id);
      }
    }

    _handleHide = () => {
      // TODO: Find a better way to compare states to see whether there are
      // changes.
      const {activity} = getInitialState(this.props);
      const hasChanges = !isEqual(activity, this.state.activity);
      const confirmed = hasChanges && confirm(
        'Are you sure you want to close the dialog? Your changes will not ' +
        'be saved'
      );

      if (!hasChanges || confirmed) {
        this.props.onHide && this.props.onHide();
      }
    }

    /**
     * Reset the form when the modal closes.
     */
    _handleExited = (e) => {
      this.props.hideActivityModal();
      this.setState(getInitialState(this.props));
    }

    _handleSave = (e) => {
      const {
        createActivity,
        initialActivity,
        updateActivity,
        user,
      } = this.props;
      const {activity} = this.state;

      const errors = {};
      Object.keys(FIELDS).forEach((name) => {
        const field = FIELDS[name];
        if (!field.isValid(activity[name])) {
          errors[name] = field.error;
        }
      });

      if (!isEmpty(errors)) {
        this.setState({errors});
        return;
      }

      this.setState({isLoading: true});

      const activityInput = {
        ...pick(activity, WHITELISTED_FIELDS),
        userId: user.id,
      };

      if (initialActivity) {
        updateActivity(initialActivity.id, activityInput);
      } else {
        createActivity(activityInput);
      }
    };
  }

  WrappedComponent.propTypes = {
    initialActivity: PropTypes.object,
    /**
     * Date object for the given day
     */
    date: PropTypes.instanceOf(Date),
    onHide: PropTypes.func,
    show: PropTypes.bool,
  };

  const mapStateToProps = ({garminActivity, pendingRequests, session}) => ({
    garminActivity,
    pendingRequests,
    user: session.user,
  });

  const activityFields = `
    avgHr,
    calories,
    distance,
    duration,
    elevationGain,
    elevationLoss,
    friends,
    id,
    maxHr,
    notes,
    startDate,
    timezone,
    shoe {
      id,
      name,
    },
    user {
      id,
      name,
    }
  `;

  const mapDispatchToProps = (dispatch) => ({
    createActivity: (input) => dispatch(makeRequest(`
      mutation createActivity($input: ActivityInput!) {
        createActivity(input: $input) {
          ${activityFields}
        }
      }
    `, {input}, ActionTypes.ACTIVITY_CREATE)),
    deleteActivity: (id) => dispatch(makeRequest(`
      mutation deleteActivity($id: ID!) {
        deleteActivity(id: $id)
      }
    `, {id}, ActionTypes.ACTIVITY_DELETE)),
    hideActivityModal,
    updateActivity: (id, input) => dispatch(makeRequest(`
      mutation updateActivity($id: ID!, $input: ActivityInput!) {
        updateActivity(id: $id, input: $input) {
          ${activityFields}
        }
      }
    `, {id, input}, ActionTypes.ACTIVITY_UPDATE)),
  });

  return connect(mapStateToProps, mapDispatchToProps)(WrappedComponent);
};

export default activityModalContainer;
