import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {Axis, Chart, Circle} from 'r-d3';
import {getInnerHeight, getInnerWidth, translate} from 'r-d3/lib/utils';
import React from 'react';

import d3Tooltip from '../../d3Tooltip';
import fullWidthChart from '../../fullWidthChart';

const TooltipCircle = d3Tooltip(Circle);

const xScale = (data, width) => {
  return d3.scaleBand()
    .rangeRound([0, getInnerWidth(width)])
    .domain(data.map((d) => d.xVal));
};

const yScale = (data, height) => {
  return d3.scaleLinear()
    .rangeRound([getInnerHeight(height), 0])
    .domain([0, d3.max(data, (d) => d.yVal)]);
};

class ScatterChart extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    tooltip: PropTypes.func,
    width: PropTypes.number,
    xFormat: PropTypes.func,
  };

  render() {
    const {data, height, width, xFormat} = this.props;

    return (
      <Chart height={height} width={width}>
        <Axis
          className="x-axis"
          orient="bottom"
          scale={xScale(data, width)}
          tickFormat={xFormat}
          transform={translate(0, getInnerHeight(height))}
        />
        <Axis
          className="y-axis"
          orient="left"
          scale={yScale(data, height)}
        />
        <Axis
          className="y-axis-background"
          orient="right"
          scale={yScale(data, height)}
          tickSize={getInnerWidth(width)}
        />
        {data.map(this._renderCircle)}
      </Chart>
    );
  }

  _renderCircle = (d, idx) => {
    const {data, height, tooltip, width} = this.props;
    const x = xScale(data, width);
    const y = yScale(data, height);

    return (
      <TooltipCircle
        cx={x(d.xVal)}
        cy={y(d.yVal)}
        key={idx}
        r={3}
        tooltip={tooltip && tooltip(d)}
      />
    );
  };
}

export default fullWidthChart(ScatterChart);
