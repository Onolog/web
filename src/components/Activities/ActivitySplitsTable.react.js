import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'react-bootstrap';

import { map } from 'lodash';
import { metersToFeet, metersToMiles } from '../../utils/distanceUtils';
import secondsToTime from '../../utils/secondsToTime';

/**
 * ActivitySplitsTable.react
 *
 * Displays data for each split/lap in a table view
 */
class ActivitySplitsTable extends React.Component {
  static displayName = 'ActivitySplitsTable';

  static propTypes = {
    laps: PropTypes.array,
  };

  render() {
    return (
      <Table border condensed hover>
        {this._renderHeaderRows()}
        {this._renderBody()}
      </Table>
    );
  }

  _renderHeaderRows = () => {
    const headerCells = map(this._getColumns(), (column, idx) => (
      <th key={idx}>{column.label}</th>
    ));

    return (
      <thead>
        <tr>
          {headerCells}
        </tr>
      </thead>
    );
  };

  _renderBody = () => {
    const { laps } = this.props;
    if (laps && laps.length) {
      return <tbody>{laps.map(this._renderRows)}</tbody>;
    }

    return (
      <tbody>
        <tr>
          <td colSpan={this._getColumns().length}>
            No splits data available
          </td>
        </tr>
      </tbody>
    );
  };

  _renderRows = (lap, idx) => {
    const cells = map(this._getColumns(), (column, idx) => {
      const value = lap[column.key];
      return (
        <td key={idx}>
          {column.formatter ? column.formatter(value) : value}
        </td>
      );
    });

    return <tr key={idx}>{cells}</tr>;
  };

  _getColumns = () => /* array */ {
    return [{
      label: 'Lap',
      key: 'lap',
    }, {
      formatter: this._formatDistance,
      label: 'Distance',
      key: 'distance',
    }, {
      formatter: secondsToTime,
      label: 'Duration',
      key: 'duration',
    }, {
      label: 'Avg. HR',
      key: 'avg_hr',
    }, {
      formatter: metersToFeet,
      label: 'Elev (ft)',
      key: 'elevation_change',
    }];
  };

  _formatDistance = (distance) => {
    return `${metersToMiles(distance)} mi`;
  };
}

export default ActivitySplitsTable;
