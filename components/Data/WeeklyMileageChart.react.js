import * as d3 from 'd3';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {Axis, Bar, Bars, Chart} from 'r-d3';
import {getInnerHeight, getInnerWidth, translate} from 'r-d3/lib/utils';
import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import Distance from '../Distance/Distance.react';
import fullWidthChart from '../../containers/fullWidthChart';
import {MARGIN} from '../../constants/d3';

class WeeklyMileageChart extends React.Component {

  render() {
    const {data, height, width, year} = this.props;

    const innerHeight = getInnerHeight(height);
    const innerWidth = getInnerWidth(width);

    const m = moment(new Date(year, 0, 1));
    const xScale = d3.scaleTime()
      .domain([
        m.week(1).day(0).toDate(),
        m.week(m.weeksInYear() + 1).day(6).toDate(),
      ])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([getInnerHeight(height), 0]);

    return (
      <Chart
        height={height}
        transform={translate(MARGIN.left, MARGIN.top)}
        width={width}>
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
        key={d.key}
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
  data: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired).isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  year: PropTypes.string.isRequired,
};

export default fullWidthChart(WeeklyMileageChart);
