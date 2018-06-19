import PropTypes from 'prop-types';
import React from 'react';
import {Button, OverlayTrigger, Tooltip} from 'react-bootstrap';

import ActivityLink from './ActivityLink.react';
import ActivityModal from './ActivityModal.react';
import BaseCalendarDay from '../Calendar/BaseCalendarDay.react';
import CalendarDate from '../Calendar/CalendarDate.react';
import Distance from '../Distance/Distance.react';
import MaterialIcon from '../Icons/MaterialIcon.react';

const LAST_DAY_OF_WEEK = 6; // Saturday (Sunday is 0)

/**
* ActivityCalendarDay.react
*/
class ActivityCalendarDay extends React.Component {
  state = {
    showModal: false,
  }

  componentWillReceiveProps(nextProps) {
    const {activities} = this.props;
    const thisCount = activities && activities.length;
    const nextCount = nextProps.activities && nextProps.activities.length;

    if (nextCount !== thisCount) {
      this._hideModal();
    }
  }

  render() {
    const {date, month} = this.props;
    const tooltip = <Tooltip id={date.toISOString()}>Add activity</Tooltip>;

    return (
      <BaseCalendarDay date={date} month={month}>
        <div className="wrapper">
          <CalendarDate date={date} />
          {this._renderActivities()}
          <OverlayTrigger overlay={tooltip} placement="right">
            <Button
              bsSize="xsmall"
              bsStyle="default"
              className="add"
              onClick={this._showModal}>
              <MaterialIcon icon="plus" />
            </Button>
          </OverlayTrigger>
          <ActivityModal
            date={date}
            onHide={this._hideModal}
            show={this.state.showModal}
          />
          {this._renderWeeklyTotal(date)}
        </div>
      </BaseCalendarDay>
    );
  }

  _renderActivities = () => /*?object*/ {
    const {activities} = this.props;
    if (activities.length) {
      return activities.map((a) => (
        <ActivityLink activity={a} key={a.id} />
      ));
    }
  }

  _renderWeeklyTotal = (dateObject) => {
    if (dateObject.getDay() === LAST_DAY_OF_WEEK) {
      return (
        <div className="total">
          <Distance
            abbreviate
            distance={this.props.weeklyMileage}
          />
        </div>
      );
    }
  }

  _hideModal = () => {
    this.setState({showModal: false});
  }

  _showModal = () => {
    this.setState({showModal: true});
  }
}

ActivityCalendarDay.propTypes = {
  /**
   * Activities for the given day
   */
  activities: PropTypes.array,
  /**
   * The date object for the day being rendered
   */
  date: PropTypes.instanceOf(Date),
  /**
   * UTC month, ie: August === 7
   */
  month: PropTypes.number,
  weeklyMileage: PropTypes.number,
};

export default ActivityCalendarDay;
