import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';
import {Button, ButtonGroup, DropdownButton, MenuItem} from 'react-bootstrap';
import {connect} from 'react-redux';

import ActivityCalendar from '../../components/Activities/ActivityCalendar.react';
import ActivityImportModal from '../../components/Activities/ActivityImportModal.react';
import ActivityModal from '../../components/Activities/ActivityModal.react';

import AppFullPage from '../../components/Page/AppFullPage.react';
import MaterialIcon from '../../components/Icons/MaterialIcon.react';
import PageFrame from '../../components/Page/PageFrame.react';
import PageHeader from '../../components/Page/PageHeader.react';

import {makeRequest} from '../../actions';
import isBrowser from '../../utils/isBrowser';

import ActionTypes from '../../constants/ActionTypes';
import {LEFT, RIGHT} from '../../constants/KeyCode';

const getDateRange = (m) => {
  const start = m
    .subtract(7, 'days')
    .toISOString(true);

  const end = m
    .add(1, 'month')
    .add(7, 'days')
    .toISOString(true);

  return [start, end];
};

const getMoment = ({month, year}) => {
  let m = moment({month: +month - 1, year});

  // Set path to today if params are invalid.
  if (!m.isValid()) {
    m = moment();
  }

  return m;
};

/**
 * CalendarController.react
 */
class CalendarController extends React.Component {
  state = {
    showAddModal: false,
    showImportModal: false,
  };

  componentWillMount() {
    const {fetchData, match: {params}, user} = this.props;

    // Load initial data.
    fetchData(getDateRange(getMoment(params)), user.id);

    isBrowser() && window.addEventListener('keydown', this._onKeyDown);
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.pendingRequests[ActionTypes.ACTIVITY_ADD] &&
      !nextProps.pendingRequests[ActionTypes.ACTIVITY_ADD]
    ) {
      this._hideModal();
    }
  }

  componentWillUnmount() {
    isBrowser() && window.removeEventListener('keydown', this._onKeyDown);
  }

  render() {
    const {activities, match: {params}, pendingRequests} = this.props;
    const isLoading =
      !activities.nodes || pendingRequests[ActionTypes.ACTIVITIES_FETCH];
    const m = getMoment(params);

    return (
      <AppFullPage title="Calendar">
        <PageHeader full title={m.format('MMMM YYYY')}>
          {this._renderButtonGroup()}
        </PageHeader>
        <PageFrame fill isLoading={isLoading}>
          <ActivityCalendar
            activities={activities.nodes || []}
            date={m.toDate()}
          />
        </PageFrame>
      </AppFullPage>
    );
  }

  _renderButtonGroup = () => {
    return (
      <div>
        <DropdownButton
          bsSize="small"
          bsStyle="success"
          id="activity-create"
          noCaret
          pullRight
          title={<MaterialIcon icon="plus" />}>
          <MenuItem onClick={this._showImportModal}>
            <MaterialIcon icon="cloud-upload" /> Import activity from URL
          </MenuItem>
          <MenuItem onClick={this._showAddModal}>
            <MaterialIcon icon="calendar-plus" /> Add manual activity
          </MenuItem>
        </DropdownButton>
        <ButtonGroup bsSize="small">
          <Button
            className="monthArrow"
            onClick={this._onLastMonthClick}>
            <MaterialIcon icon="arrow-left" />
          </Button>
          <Button onClick={this._onThisMonthClick}>
            Today
          </Button>
          <Button
            className="monthArrow"
            onClick={this._onNextMonthClick}>
            <MaterialIcon icon="arrow-right" />
          </Button>
        </ButtonGroup>
        <ActivityModal
          onHide={this._hideModal}
          show={this.state.showAddModal}
        />
        <ActivityImportModal
          onHide={this._hideModal}
          show={this.state.showImportModal}
        />
      </div>
    );
  };

  _hideModal = () => {
    this.setState({
      showAddModal: false,
      showImportModal: false,
    });
  };

  _showAddModal = () => {
    this.setState({showAddModal: true});
  };

  _showImportModal = () => {
    this.setState({showImportModal: true});
  };

  _onKeyDown = (e) => {
    const tagName = e.target.tagName.toLowerCase();

    // Don't cycle through the months if...
    if (
      // A modal is open...
      this.state.showAddModal || this.state.showImportModal ||
      // Typing in an input or textarea...
      tagName === 'input' || tagName === 'textarea' ||
      // The `command` or `control` key is also not pressed...
      !(e.metaKey || e.ctrlKey)
    ) {
      return;
    }

    switch (e.keyCode) {
      case LEFT:
        e.preventDefault();
        this._onLastMonthClick();
        break;
      case RIGHT:
        e.preventDefault();
        this._onNextMonthClick();
        break;
    }
  }

  _onLastMonthClick = () => {
    this._updateCalendar(getMoment(this.props.match.params).subtract({months: 1}));
  };

  _onThisMonthClick = () => {
    this._updateCalendar(moment());
  };

  _onNextMonthClick = () => {
    this._updateCalendar(getMoment(this.props.match.params).add({months: 1}));
  };

  _updateCalendar = (newMoment) => {
    const {fetchData, history, match, user} = this.props;

    // Don't update if the month hasn't changed.
    if (newMoment.isSame(getMoment(match.params), 'month')) {
      return;
    }

    history.push(newMoment.format('/YYYY/MM'));

    fetchData(getDateRange(newMoment), user.id);
  };
}

CalendarController.propTypes = {
  activities: PropTypes.object.isRequired,
  pendingRequests: PropTypes.shape({
    [ActionTypes.ACTIVITIES_FETCH]: PropTypes.bool,
    [ActionTypes.ACTIVITY_ADD]: PropTypes.bool,
  }).isRequired,
};

const mapStateToProps = ({activities, pendingRequests, session}) => {
  return {
    activities,
    pendingRequests,
    user: session.user,
  };
};

const mapDispatchToProps = (dispatch) => ({
  // TODO: Don't fetch full activity here. Fetch enough to render the calendar,
  // then fetch the full activity when opening the activity modal.
  fetchData: (range, userId) => dispatch(makeRequest(`
    query activities($userId: ID, $range: [String]) {
      activities(userId: $userId, range: $range) {
        nodes {
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
          }
          user {
            id,
            name,
          }
        }
      },
    }
  `, {range, userId}, ActionTypes.ACTIVITIES_FETCH)),
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(CalendarController);
