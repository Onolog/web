import PropTypes from 'prop-types';
import React from 'react';

import ScrollContainer from '../ScrollContainer/ScrollContainer.react';
import secondsToTime from '../../utils/secondsToTime';

import {PACES} from '../../constants/Daniels';

function formatTime(seconds) {
  return seconds < 100 ? seconds : secondsToTime(seconds);
}

class PaceTable extends React.Component {
  static propTypes = {
    vdot: PropTypes.number,
  };

  render() {
    return (
      <div className="table-container">
        <table className="paces">
          <thead>
            <tr className="header">
              <th rowSpan="2">VDOT</th>
              <th>E Pace</th>
              <th>M Pace</th>
              <th colSpan="3">T Pace</th>
              <th colSpan="4">I Pace</th>
              <th className="lastCol" colSpan="3">R Pace</th>
              <th rowSpan="2">VDOT</th>
            </tr>
            <tr className="distance">
              <th className="lastCol">Mile</th>
              <th className="lastCol">Mile</th>
              <th>400m</th>
              <th>1000m</th>
              <th className="lastCol">Mile</th>
              <th>400m</th>
              <th>1000m</th>
              <th>1200m</th>
              <th className="lastCol">Mile</th>
              <th>200m</th>
              <th>400m</th>
              <th>800m</th>
            </tr>
          </thead>
        </table>
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

  _getRows = () => {
    const rows = [];
    const vdots = this.props.vdot ? [this.props.vdot] : Object.keys(PACES);

    vdots.forEach((vdot) => {
      rows.push(
        <tr key={vdot}>
          {this._getCells(vdot)}
        </tr>
      );
    });

    return rows;
  };

  _getCells = (vdot) => {
    const cells = [];
    const paces = PACES[vdot];

    for (let intensity in paces) {
      if (!paces.hasOwnProperty(intensity)) {
        continue;
      }

      for (let distance in paces[intensity]) {
        if (!paces[intensity].hasOwnProperty(distance)) {
          continue;
        }

        const seconds = paces[intensity][distance];

        cells.push(
          <td key={`${vdot}.${intensity}.${distance}`}>
            {seconds ? formatTime(seconds) : '·'}
          </td>
        );
      }
    }

    // Add the vdot value as the first and last cell
    cells.unshift(<td className="vdot" key={vdot + '-l'}>{vdot}</td>);
    cells.push(<td className="vdot" key={vdot + '-r'}>{vdot}</td>);

    return cells;
  };
}

export default PaceTable;
