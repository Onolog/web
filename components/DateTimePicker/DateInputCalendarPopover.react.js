import moment from 'moment';
import PropTypes from 'prop-types';
import React from 'react';

import DateInputCalendar from './DateInputCalendar.react';
import Link from '../Link/Link.react';
import MaterialIcon from '../Icons/MaterialIcon.react';

import cx from 'classnames';

import {ESC, LEFT, RIGHT} from '../../constants/KeyCode';

/**
 * DateInputCalendarPopover.react.js
 *
 * Renders a popover displaying a single-month calendar and controls for
 * changing the displayed month. The visibility of the popover is controlled
 * externally.
 */
class DateInputCalendarPopover extends React.Component {
  static displayName = 'DateInputCalendarPopover';

  static propTypes = {
    date: PropTypes.number.isRequired,
    months: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    years: PropTypes.number.isRequired,
  };

  componentDidMount() {
    window.addEventListener('keydown', this._onKeydown);
  }

  componentWillReceiveProps(nextProps) {
    // When hiding or showing the popover, the date shown by the calendar
    // should be the same as the selected date.
    if (this.props.show !== nextProps.show) {
      this.setState({calendarMoment: this._getMoment(nextProps)});
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this._onKeydown);
  }

  render() {
    if (!this.props.show) {
      return null;
    }

    const {calendarMoment} = this.state;

    return (
      <div className={cx('popover', 'fade', 'bottom', 'in')}>
        <div className="arrow" />
        <div className="popover-header DateInputCalendarControls">
          <Link
            className="monthArrow arrowLeft"
            href="#"
            onClick={this._onPrevMonthClick}>
            <MaterialIcon icon="arrow-left" />
          </Link>
          <div className="DateInputCalendarControls-monthYear">
            {calendarMoment.format('MMMM YYYY')}
          </div>
          <Link
            className="monthArrow arrowRight"
            href="#"
            onClick={this._onNextMonthClick}>
            <MaterialIcon icon="arrow-right" />
          </Link>
        </div>
        <div className="popover-content">
          <DateInputCalendar
            month={calendarMoment.month()}
            onChange={this.props.onChange}
            selectedDate={this._getMoment(this.props).toDate()}
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
      }
    }
  };

  _onPrevMonthClick = (e) => {
    e.preventDefault();
    this.setState({
      calendarMoment: this.state.calendarMoment.subtract(1, 'month'),
    });
  };

  _onNextMonthClick = (e) => {
    e.preventDefault();
    this.setState({
      calendarMoment: this.state.calendarMoment.add(1, 'month'),
    });
  };

  _getMoment = ({date, months, years}) => {
    return moment().year(years).month(months).date(date);
  };

  state = {
    calendarMoment: this._getMoment(this.props),
  };
}

module.exports = DateInputCalendarPopover;
