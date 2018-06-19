import React from 'react';

/**
 * BaseCalendarWeek.react
 *
 * Renders a single row in the calendar grid (ie: one week)
 */
class BaseCalendarWeek extends React.Component {
  static displayName = 'BaseCalendarWeek';

  render() {
    return <tr>{this.props.children}</tr>;
  }
}

module.exports = BaseCalendarWeek;
