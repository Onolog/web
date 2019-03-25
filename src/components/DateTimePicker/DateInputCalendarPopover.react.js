import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import cx from 'classnames';
import DateInputCalendar from './DateInputCalendar.react';
import LinkButton from '../LinkButton/LinkButton.react';
import MaterialIcon from '../Icons/MaterialIcon.react';

import { ESC, LEFT, RIGHT } from '../../constants/KeyCode';

function getMoment({ date, months, years }) {
  return moment().year(years).month(months).date(date);
}

/**
 * DateInputCalendarPopover.react.js
 *
 * Renders a popover displaying a single-month calendar and controls for
 * changing the displayed month. The visibility of the popover is controlled
 * externally.
 */
class DateInputCalendarPopover extends React.Component {
  /* eslint-disable react/no-unused-prop-types */
  static propTypes = {
    date: PropTypes.number.isRequired,
    months: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    years: PropTypes.number.isRequired,
  };
  /* eslint-enable react/no-unused-prop-types */

  state = {
    calendarMoment: getMoment(this.props),
  };

  componentDidMount() {
    window.addEventListener('keydown', this._onKeydown);
  }

  componentWillReceiveProps(nextProps) {
    // When hiding or showing the popover, the date shown by the calendar
    // should be the same as the selected date.
    if (this.props.show !== nextProps.show) {
      this.setState({ calendarMoment: getMoment(nextProps) });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._onKeydown);
  }

  render() {
    if (!this.props.show) {
      return null;
    }

    const { calendarMoment } = this.state;

    return (
      <div className={cx('popover', 'fade', 'bottom', 'in')}>
        <div className="arrow" />
        <div className="popover-header DateInputCalendarControls">
          <LinkButton
            className="monthArrow arrowLeft"
            onClick={this._onPrevMonthClick}>
            <MaterialIcon icon="arrow-left" />
          </LinkButton>
          <div className="DateInputCalendarControls-monthYear">
            {calendarMoment.format('MMMM YYYY')}
          </div>
          <LinkButton
            className="monthArrow arrowRight"
            onClick={this._onNextMonthClick}>
            <MaterialIcon icon="arrow-right" />
          </LinkButton>
        </div>
        <div className="popover-content">
          <DateInputCalendar
            month={calendarMoment.month()}
            onChange={this.props.onChange}
            selectedDate={getMoment(this.props).toDate()}
            year={calendarMoment.year()}
          />
        </div>
      </div>
    );
  }

  _onKeydown = (e) => {
    if (this.props.show) {
      switch (e.keyCode) {
        case ESC:
          this.props.onHide();
          break;
        case LEFT:
          this._onPrevMonthClick(e);
          break;
        case RIGHT:
          this._onNextMonthClick(e);
          break;
        default:
          break;
      }
    }
  };

  _onPrevMonthClick = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      calendarMoment: state.calendarMoment.subtract(1, 'month'),
    }));
  };

  _onNextMonthClick = (e) => {
    e.preventDefault();
    this.setState((state) => ({
      calendarMoment: state.calendarMoment.add(1, 'month'),
    }));
  };
}

export default DateInputCalendarPopover;
