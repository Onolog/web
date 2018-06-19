import PropTypes from 'prop-types';
import React from 'react';

import ScrollContainer from '../ScrollContainer/ScrollContainer.react';
import secondsToTime from '../../utils/secondsToTime';

import {DISTANCES, PACES, TIMES} from '../../constants/Daniels';

function formatTime(/*number*/ seconds) /*string*/ {
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
              <tr className="header">
                {this._getHeaderCells()}
              </tr>
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

  _getHeaderCells = () => /*array*/ {
    const headerCells = DISTANCES.map((distance) => (
      <th key={distance.value}>
        {distance.label}
      </th>
    ));

    headerCells.push(<th key="vdot-r">VDOT</th>);
    headerCells.unshift(<th key="vdot-l">VDOT</th>);

    return headerCells;
  };

  _getRows = () => /*array*/ {
    const {vdot} = this.props;
    const rows = [];
    const vdots = vdot ? [vdot] : Object.keys(PACES);

    vdots.forEach((vdot) => {
      rows.push(<tr key={vdot}>{this._getCells(vdot)}</tr>);
    });

    return rows;
  };

  _getCells = (vdot) => /*array*/ {
    const cells = [];
    const distances = Object.keys(TIMES);

    distances.forEach((distance, idx) => {
      cells.push(
        <td key={idx}>
          {formatTime(TIMES[distance][vdot])}
        </td>
      );
    });

    // Add the vdot value as the first and last cell
    cells.unshift(<td className="vdot" key={vdot + '-l'}>{vdot}</td>);
    cells.push(<td className="vdot" key={vdot + '-r'}>{vdot}</td>);

    return cells;
  };
}

export default DistanceTable;
