import * as d3 from 'd3';
import { range } from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import { Axis, Bar, Bars } from 'r-d3';
import { getInnerHeight, getInnerWidth, translate } from 'r-d3/lib/utils';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import Chart from './Chart.react';
import Distance from '../Distance/Distance.react';
import fluidChart from '../../containers/fluidChart';
import { MARGIN } from '../../constants/d3';

const MONTHS_IN_YEAR = 12;

class MonthlyMileageChart extends React.Component {
  render() {
    const { activities, height, width, ...props } = this.props;

    // Transform data for consumption.
    const data = d3.nest()
      .key((a) => moment.tz(a.startDate, a.timezone).month())
      .rollup((activities) => d3.sum(activities, (a) => a.distance))
      .entries(activities);

    const innerHeight = getInnerHeight(height);
    const innerWidth = getInnerWidth(width);

    const xScale = d3.scaleBand()
      .domain(range(MONTHS_IN_YEAR))
      .rangeRound([0, innerWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .rangeRound([innerHeight, 0]);

    return (
      <Chart {...props} transform={translate(MARGIN.left, MARGIN.top)}>
        <Axis
          className="x-axis"
          orient="bottom"
          scale={xScale}
          tickFormat={(month) => moment().month(month).format('MMM')}
          ticks={MONTHS_IN_YEAR}
          transform={translate(0, innerHeight)}
        />
        <Axis
          className="y-axis"
          orient="left"
          scale={yScale}
        />
        <Axis
          className="y-axis-background"
          orient="right"
          scale={yScale}
          tickSize={innerWidth}
        />
        <Bars>
          {data.map((d) => this._renderBar(d, xScale, yScale))}
        </Bars>
      </Chart>
    );
  }

  _renderBar = (d, xScale, yScale) => {
    const { height, year } = this.props;

    const distance = d.value;
    const month = d.key;

    const width = getInnerWidth(this.props.width) / MONTHS_IN_YEAR - 2;

    return (
      <OverlayTrigger
        key={month}
        overlay={
          <Tooltip id={`${year}-${month}`}>
            <strong>
              {moment().month(month).year(year).format('MMMM YYYY')}
            </strong>
            <div>
              <Distance distance={distance} />
            </div>
          </Tooltip>
        }
        placement="top">
        <Bar
          data={d}
          height={getInnerHeight(height) - yScale(distance)}
          width={width >= 0 ? width : 0}
          x={xScale(month)}
          y={yScale(distance)}
        />
      </OverlayTrigger>
    );
  };
}

MonthlyMileageChart.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    distance: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
  })).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};

export default fluidChart(MonthlyMileageChart);
