import PropTypes from 'prop-types';
import {bisect} from 'r-d3/lib/utils';
import React from 'react';

import ElevationChart from './ElevationChart.react';
import GoogleMap from '../Google/GoogleMap.react';
import VitalsChart from './VitalsChart.react';

import secondsToTime from '../../utils/secondsToTime';

import './css/ActivityChart.scss';

class ActivityChart extends React.Component {
  state = {
    mousePos: null,
  };

  render() {
    const {data} = this.props;
    const {mousePos} = this.state;

    const commonProps = {
      data,
      mousePos,
      onMouseMove: this._handleMouseMove,
      onMouseOut: this._handleMouseOut,
    };

    return (
      <div className="activity-chart clearfix">
        <div className="map-container">
          <GoogleMap
            className="activity-map"
            cursorPos={mousePos}
            onPolylineMouseMove={(index) => {
              this.setState({mousePos: data[index]});
            }}
            path={data}
          />
        </div>
        <div className="chart-container">
          <ElevationChart
            {...commonProps}
            className="elevation-chart"
            height={150}
          />
          <VitalsChart
            {...commonProps}
            className="pace-chart"
            invert
            metric="pace"
            yFormat={secondsToTime}
          />
          <VitalsChart
            {...commonProps}
            className="hr-chart"
            metric="hr"
            yFormat={(y) => y}
          />
        </div>
      </div>
    );
  }

  _handleMouseMove = (mouse, xScale, yScale) => {
    const mousePos = bisect(
      this.props.data,
      xScale.invert(mouse[0]),
      (d) => d.distance
    );
    this.setState({mousePos});
  }

  _handleMouseOut = (e) => {
    this.setState({mousePos: null});
  }
}

ActivityChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    distance: PropTypes.number.isRequired,
    hr: PropTypes.number.isRequired,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    pace: PropTypes.number.isRequired,
  }).isRequired).isRequired,
};

export default ActivityChart;
