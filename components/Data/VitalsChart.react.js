import * as d3 from 'd3';
import PropTypes from 'prop-types';
import { Axis, Line, MouseTracker } from 'r-d3/lib';
import { getInnerHeight, getInnerWidth, translate } from 'r-d3/lib/utils';
import React from 'react';

import Chart from './Chart.react';
import MouseIndicator from './MouseIndicator.react';

import fluidChart from '../../containers/fluidChart';
import { MARGIN } from '../../constants/d3';

const VitalsChart = (props) => {
  const {
    className,
    data,
    height,
    invert,
    metric,
    mousePos,
    preserveAspectRatio,
    viewBox,
    width,
    yFormat,
    ...otherProps
  } = props;

  const innerHeight = getInnerHeight(height, { top: 0 });
  const innerWidth = getInnerWidth(width);

  const xScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d.distance)])
    .range([0, innerWidth]);

  const yDomain = d3.extent(data, (d) => d[metric]);
  if (invert) {
    yDomain.reverse();
  }

  const yScale = d3.scaleLinear()
    .domain(yDomain)
    .range([innerHeight, 0]);

  const mean = d3.mean(data, (d) => d[metric]);

  const x = (d) => xScale(d.distance);
  const y = (d) => yScale(d[metric]);

  return (
    <Chart
      className={className}
      preserveAspectRatio={preserveAspectRatio}
      transform={translate(MARGIN.left, MARGIN.top)}
      viewBox={viewBox}>
      <Axis
        className="y-axis"
        orient="left"
        scale={yScale}
        tickFormat={yFormat}
        ticks={2}
      />
      <Axis
        className="y-axis-background"
        orient="right"
        scale={yScale}
        ticks={2}
        tickSize={innerWidth}
      />
      <Line
        className="mean-line"
        data={[
          { distance: 0, [metric]: mean },
          { distance: d3.max(data, (d) => d.distance), [metric]: mean },
        ]}
        x={x}
        y={y}
      />
      <Line
        curve={d3.curveNatural}
        data={data}
        x={x}
        y={y}
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
        yFormat={(d) => yFormat(d[metric])}
      />
    </Chart>
  );
};

VitalsChart.propTypes = {
  data: PropTypes.array.isRequired,
  height: PropTypes.number,
  invert: PropTypes.bool,
  mousePos: PropTypes.object,
  width: PropTypes.number.isRequired,
  yFormat: PropTypes.func,
};

VitalsChart.defaultProps = {
  height: 80,
  invert: false,
};

export default fluidChart(VitalsChart);
