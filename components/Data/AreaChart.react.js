import * as d3 from 'd3';
import PropTypes from 'prop-types';
import {Area, Axis, Chart} from 'r-d3';
import {getInnerHeight, getInnerWidth, translate} from 'r-d3/lib/utils';
import React from 'react';

import fullWidthChart from '../../containers/fullWidthChart';

class AreaChart extends React.Component {
  static propTypes = {
    data: PropTypes.array.isRequired,
    height: PropTypes.number.isRequired,
    tooltip: PropTypes.func,
    width: PropTypes.number.isRequired,
    xFormat: PropTypes.func,
  }

  render() {
    const {data, height, width, xFormat} = this.props;
    const innerHeight = getInnerHeight(height);

    const x = d3.scaleBand()
      .domain(data.map((d) => d.xVal))
      .rangeRound([0, getInnerWidth(width)]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.yVal)])
      .rangeRound([innerHeight, 0]);

    return (
      <Chart height={height} width={width}>
        <Axis
          className="x-axis"
          orient="bottom"
          scale={x}
          tickFormat={xFormat}
          transform={translate(0, innerHeight)}
        />
        <Axis
          className="y-axis"
          orient="left"
          scale={y}
        />
        <Axis
          className="y-axis-background"
          orient="right"
          scale={y}
          tickSize={getInnerWidth(width)}
        />
        <Area
          data={data}
          x={(d) => x(d.xVal)}
          y0={innerHeight}
          y1={(d) => y(d.yVal)}
        />
      </Chart>
    );
  }
}

export default fullWidthChart(AreaChart);
