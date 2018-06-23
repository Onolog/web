import moment from 'moment';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import React from 'react';

import DateInputCalendarPopover from './DateInputCalendarPopover.react';
import MaterialIcon from '../Icons/MaterialIcon.react';

import {RETURN} from '../../constants/KeyCode';

/**
 * DateInput.react
 *
 * Structured input for selecting a date via a calendar picker.
 */
class DateInput extends React.Component {
  static displayName = 'DateInput';

  static propTypes = {
    date: PropTypes.number.isRequired,
    months: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    years: PropTypes.number.isRequired,
  };

  state = {
    showCalendar: false,
  };

  render() {
    const {date, months, years} = this.props;
    var m = moment({date, months, years});

    return (
      <div className="DateInput">
        <div
          className="form-control"
          onClick={this._showCalendar}
          onKeyDown={this._handleKeyDown}
          role="button"
          tabIndex={0}>
          <div className="DateInputDisplay">
            {m.format('M/D/YYYY')}
          </div>
          <MaterialIcon
            className="DateInputCalendarIcon"
            icon="calendar"
          />
        </div>
        <DateInputCalendarPopover
          {...this.props}
          onChange={this._onChange}
          onHide={this._hideCalendar}
          show={this.state.showCalendar}
        />
      </div>
    );
  }

  _handleKeyDown = (e) => {
    switch (e.keyCode) {
      case RETURN:
        this._showCalendar();
        break;
    }
  }

  _hideCalendar = () => {
    this.setState({showCalendar: false});
  }

  _showCalendar = () => {
    this.setState({showCalendar: true});
  }

  /**
   * From `onClickOutside` HoC.
   */
  handleClickOutside = (e) => {
    this._hideCalendar();
  }

  _onChange = (dateObject) => {
    this._hideCalendar();
    this.props.onChange(dateObject);
  }
}

export default onClickOutside(DateInput);
