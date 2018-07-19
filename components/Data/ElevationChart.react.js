import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {Area, Axis, MouseTracker} from 'r-d3/lib';
import {getInnerHeight, getInnerWidth, translate} from 'r-d3/lib/utils';
import React from 'react';

import Chart from './Chart.react';
import MouseIndicator from './MouseIndicator.react';

import fluidChart from '../../containers/fluidChart';

import {MARGIN} from '../../constants/d3';
const Y_TICKS = 3;

class ElevationChart extends React.Component {
  render() {
    const {
      className,
      data,
      height,
      mousePos,
      preserveAspectRatio,
      viewBox,
      width,
      ...otherProps
    } = this.props;

    const innerHeight = getInnerHeight(height);
    const innerWidth = getInnerWidth(width);

    const xScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.distance)])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.elevation)])
      .range([innerHeight, 0]);

    const x = (d) => xScale(d.distance);
    const y = (d) => yScale(d.elevation);
    const yFormat = (elevation) => `${elevation} ft`;

    return (
      <Chart
        className={className}
        preserveAspectRatio={preserveAspectRatio}
        transform={translate(MARGIN.left, MARGIN.top)}
        viewBox={viewBox}>
        <Axis
          className="x-axis"
          orient="bottom"
          scale={xScale}
          tickFormat={(distance) => `${distance.toFixed(1)} mi`}
          transform={translate(0, innerHeight)}
        />
        <Axis
          className="y-axis"
          orient="left"
          scale={yScale}
          tickFormat={yFormat}
          ticks={Y_TICKS}
        />
        <Axis
          className="y-axis-background"
          orient="right"
          scale={yScale}
          ticks={Y_TICKS}
          tickSize={innerWidth}
        />
        <Area
          data={data}
          x={x}
          y0={innerHeight}
          y1={y}
        />
        <MouseTracker
          {...otherProps}
          xScale={xScale}
          yScale={yScale}
        />
        <MouseIndicator
          d={mousePos}
          height={innerHeight}
          x={x}
          y={y}
          yFormat={(d) => yFormat(d.elevation)}
        />
      </Chart>
    );
  }
}

ElevationChart.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  mousePos: PropTypes.object,
  width: PropTypes.number.isRequired,
};

export default fluidChart(ElevationChart);
