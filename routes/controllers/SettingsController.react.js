import {isEmpty, isEqual, pick} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';

import AppFullPage from '../../components/Page/AppFullPage.react';
import LocationSettingsSection from '../../components/Settings/LocationSettingsSection.react';
import PageFrame from '../../components/Page/PageFrame.react';
import PageHeader from '../../components/Page/PageHeader.react';
import ProfileSettingsSection from '../../components/Settings/ProfileSettingsSection.react';
import SettingsListGroup from '../../components/Settings/SettingsListGroup.react';
import UnitsSettingsSection from '../../components/Settings/UnitsSettingsSection.react';

import {makeRequest} from '../../actions';

import ActionTypes from '../../constants/ActionTypes';

const TITLE = 'Settings';

// Whitelist the settings that can be updated.
const MUTABLE_FIELDS = [
  'distanceUnits',
  'email',
  'firstName',
  'lastName',
  'timezone',
];

const getMutableFields = (user) => pick(user, MUTABLE_FIELDS);

/**
 * SettingsController.react
 */
class SettingsController extends React.Component {
  constructor(props) {
    super(props);
    this.state = props.user;
  }

  componentWillMount() {
    this.props.fetchData(this.props.session.user.id);
  }

  componentDidMount() {
    this._unblockRouter = this.props.history.block(this._handleNavigateAway);
  }

  componentWillReceiveProps({user}) {
    if (!isEqual(this.props.user, user)) {
      this.setState(user);
    }
  }

  componentWillUnmount() {
    this._unblockRouter();
  }

  render() {
    const {pendingRequests, user} = this.props;

    const isLoading =
      isEmpty(user) ||
      pendingRequests[ActionTypes.USER_FETCH] ||
      pendingRequests[ActionTypes.USER_SETTINGS_SAVE];

    const disabled = !this._hasChanges() || isLoading;

    return (
      <AppFullPage title={TITLE}>
        <PageHeader full title={TITLE}>
          <Button
            bsSize="small"
            bsStyle="default"
            disabled={disabled}
            onClick={() => this.setState(user)}>
            Revert Changes
          </Button>
          <Button
            bsSize="small"
            bsStyle="primary"
            disabled={disabled}
            onClick={this._handleSave}>
            Save Changes
          </Button>
        </PageHeader>
        <PageFrame
          fill
          isLoading={isLoading}
          scroll>
          {this._renderContent(isLoading)}
        </PageFrame>
      </AppFullPage>
    );
  }

  _renderContent = (isLoading) => {
    if (isLoading) {
      return null;
    }

    return (
      <SettingsListGroup>
        <ProfileSettingsSection
          onChange={this._handleChange}
          user={this.state}
        />
        <LocationSettingsSection
          onChange={this._handleChange}
          user={this.state}
        />
        <UnitsSettingsSection
          onChange={this._handleChange}
          user={this.state}
        />
      </SettingsListGroup>
    );
  };

  _handleChange = (e) => {
    const newState = {};
    const {name, value} = e.target;

    switch (name) {
      case 'distanceUnits':
        // Cast string value to an int.
        newState[name] = parseInt(value, 10);
        break;
      default:
        newState[name] = value;
        break;
    }

    this.setState(newState);
  };

  _handleNavigateAway = (nextLocation) => {
    if (this._hasChanges()) {
      return (
        'Are you sure you want to leave? Your settings have not been saved.'
      );
    }
  }

  _handleSave = (e) => {
    const {updateUser, user} = this.props;
    const {email, firstName, lastName} = this.state;

    // TODO: Better client-side validation.
    if (!email.trim()) {
      alert('Email cannot be empty.');
      return;
    }

    if (!firstName.trim()) {
      alert('First name cannot be empty.');
      return;
    }

    if (!lastName.trim()) {
      alert('Last name cannot be empty.');
      return;
    }

    updateUser(user.id, getMutableFields(this.state));
  }

  _hasChanges = () => {
    return !isEqual(
      getMutableFields(this.state),
      getMutableFields(this.props.user)
    );
  }
}

SettingsController.propTypes = {
  pendingRequests: PropTypes.shape({
    [ActionTypes.USER_FETCH]: PropTypes.bool,
    [ActionTypes.USER_SETTINGS_SAVE]: PropTypes.bool,
  }).isRequired,
  user: PropTypes.shape({
    id: PropTypes.string,
    distanceUnits: PropTypes.number,
    email: PropTypes.string,
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    timezone: PropTypes.string,
  }),
};

const mapStateToProps = ({pendingRequests, session, user}) => ({
  pendingRequests,
  session,
  user,
});

const userFields = `
  id,
  distanceUnits,
  email,
  name,
  firstName,
  lastName,
  timezone,
`;

const mapDispatchToProps = (dispatch) => ({
  fetchData: (userId) => dispatch(makeRequest(`
    query user($userId: ID!) {
      user(id: $userId) {
        ${userFields}
      }
    }
  `, {userId}, ActionTypes.USER_FETCH)),
  updateUser: (id, input) => dispatch(makeRequest(`
    mutation updateUser($id: ID!, $input: UserInput!) {
      updateUser(id: $id, input: $input) {
        ${userFields}
      }
    }
  `, {id, input}, ActionTypes.USER_UPDATE)),
});

module.exports = connect(
  mapStateToProps,
  mapDispatchToProps
)(SettingsController);