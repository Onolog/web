import PropTypes from 'prop-types';
import React from 'react';
import moment from 'moment';

import './css/Calendar.scss';

const ISO_DAY_OF_WEEK = 'E';

/**
 * BaseCalendar.react
 */
class BaseCalendar extends React.Component {
  render() {
    return (
      <table className={this.props.className}>
        {this._renderHeaderRow()}
        <tbody>
          {this.props.children}
        </tbody>
      </table>
    );
  }

  /**
   * Renders the days of the week in the header cells ('Sun', 'Mon', etc.).
   */
  _renderHeaderRow = () => {
    // TODO: Allow for different week start days. Sunday (7) is currently first.
    var headerCells = [7, 1, 2, 3, 4, 5, 6].map((day) => {
      return <th key={day}>{this._formatDayOfWeek(day)}</th>;
    });

    return <thead><tr>{headerCells}</tr></thead>;
  };

  _formatDayOfWeek = (day) => {
    var format = this.props.headerFormat;
    var substr = false;

    // Moment doesn't support formatting days as a single letter,
    // so just do it manually.
    if (format === 'd') {
      format = 'dd';
      substr = true;
    }

    var formatted = moment(day, ISO_DAY_OF_WEEK).format(format);
    return substr ? formatted.substr(0, 1) : formatted;
  };
}

BaseCalendar.propTypes = {
  borders: PropTypes.bool,
  headerFormat: PropTypes.oneOf([
    'd',    // M, T, W...
    'dd',   // Mo, Tu, We...
    'ddd',  // Mon, Tue, Wed...
    'dddd', // Monday, Tuesday, Wednesday...
  ]),
};

BaseCalendar.defaultProps = {
  borders: true,
  headerFormat: 'ddd',
};

export default BaseCalendar;
