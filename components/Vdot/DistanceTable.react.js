import PropTypes from 'prop-types';
import React from 'react';

import ScrollContainer from '../ScrollContainer/ScrollContainer.react';
import secondsToTime from '../../utils/secondsToTime';

import { DISTANCES, PACES, TIMES } from '../../constants/Daniels';

function formatTime(/* number */ seconds) /* string */ {
  const [sec, dec] = seconds.toString().split('.');
  const arr = [secondsToTime(sec)];

  if (dec != null) {
    arr.push(dec);
  }

  return arr.join('.');
}

/**
 * Daniels Distance Tables
 *
 * Displays a table of VDOT values associated with times raced over popular
 * distances.
 */
class DistanceTable extends React.Component {
  static propTypes = {
    vdot: PropTypes.number,
  };

  render() {
    return (
      <div className="table-container">
        <div className="table-header">
          <table className="paces">
            <thead>
              {this._getHeaderRow()}
            </thead>
          </table>
        </div>
        <ScrollContainer>
          <table className="paces">
            <tbody>
              {this._getRows()}
            </tbody>
          </table>
        </ScrollContainer>
      </div>
    );
  }

  _getHeaderRow = () => {
    return (
      <tr className="header">
        <th key="vdot-r">VDOT</th>
        {DISTANCES.map((distance) => (
          <th key={distance.value}>
            {distance.label}
          </th>
        ))}
        <th key="vdot-l">VDOT</th>
      </tr>
    );
  };

  _getRows = () => {
    const { vdot } = this.props;
    const rows = [];
    const vdots = vdot ? [vdot] : Object.keys(PACES);

    vdots.forEach((vdot) => {
      rows.push(this._getCells(vdot));
    });

    return rows;
  };

  _getCells = (vdot) => {
    const cells = [];

    Object.keys(TIMES).forEach((distance) => {
      cells.push(
        <td key={distance}>
          {formatTime(TIMES[distance][vdot])}
        </td>
      );
    });

    return (
      <tr key={vdot}>
        <td className="vdot" key={`${vdot}-l`}>
          {vdot}
        </td>
        {cells}
        <td className="vdot" key={`${vdot}-r`}>
          {vdot}
        </td>
      </tr>
    );
  };
}

export default DistanceTable;
