import * as d3 from 'd3';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {Axis, Bar, Bars} from 'r-d3';
import {getInnerHeight, getInnerWidth, translate} from 'r-d3/lib/utils';
import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import Chart from './Chart.react';
import Distance from '../Distance/Distance.react';
import fluidChart from '../../containers/fluidChart';
import {MARGIN} from '../../constants/d3';

class WeeklyMileageChart extends React.Component {
  render() {
    const {activities, height, width, year, ...props} = this.props;

    // Transform data for consumption.
    const data = d3.nest()
      .key((a) => moment.tz(a.startDate, a.timezone).week())
      .rollup((activities) => d3.sum(activities, (a) => a.distance))
      .entries(activities);

    const innerHeight = getInnerHeight(height);
    const innerWidth = getInnerWidth(width);

    const m = moment().year(year).startOf('year');
    const startDate = m.clone().week(1).day(0).toDate();
    const endDate = m.clone().week(m.weeksInYear() + 1).day(6).toDate();

    const xScale = d3.scaleTime()
      .domain([startDate, endDate])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([innerHeight, 0]);

    return (
      <Chart {...props} transform={translate(MARGIN.left, MARGIN.top)}>
        <Axis
          className="x-axis"
          orient="bottom"
          scale={xScale}
          tickFormat={(date) => moment(date).format('MMM')}
          ticks={12}
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
    const {height, width, year} = this.props;

    // First day of the nth week for the given year.
    const m = moment().year(year).week(d.key).day(0);
    const weeksInYear = m.weeksInYear();

    return (
      <OverlayTrigger
        key={`${year}-${d.key}`}
        overlay={
          <Tooltip id={d.key}>
            <strong>
              {m.format('MMM D')} &ndash; {m.add(6, 'days').format('MMM D')}
            </strong>
            <div>
              <Distance distance={d.value} />
            </div>
          </Tooltip>
        }
        placement="top">
        <Bar
          data={d}
          height={getInnerHeight(height) - yScale(d.value)}
          width={getInnerWidth(width) / weeksInYear - 2}
          x={xScale(m.toDate()) - 22}
          y={yScale(d.value)}
        />
      </OverlayTrigger>
    );
  };
}

WeeklyMileageChart.propTypes = {
  activities: PropTypes.arrayOf(PropTypes.shape({
    distance: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    timezone: PropTypes.string.isRequired,
  })).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  year: PropTypes.number.isRequired,
};

export default fluidChart(WeeklyMileageChart);
