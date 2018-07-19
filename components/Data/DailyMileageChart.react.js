import * as d3 from 'd3';
import {range} from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {Chart} from 'r-d3';
import {translate} from 'r-d3/lib/utils';
import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';

import Distance from '../Distance/Distance.react';

const COLOR_RANGE = [
  // Brand blue
  // '#d4e8f7',
  // '#1f8dd6',

  // Brand Green
  // '#e7f4e7',
  // '#d7eed6',
  // '#5cb85c',

  //
  '#e1efc6',
  '#074e15',

  // Github green
  // '#ebedf0',
  // '#e5f9be',
  // '#c6e48b',
  // '#7bc96f',
  // '#239a3b',
  // '#196127',
];

const labelStyle = {
  fill: '#808080',
  fontSize: '9px',
};

class DailyMileageChart extends React.Component {
  render() {
    const {activities, cellSize, height, spacing, width, year} = this.props;
    const size = cellSize + spacing;

    const logScale = d3.scaleLog()
      .domain(d3.extent(activities, (a) => a.distance));

    this._color = d3.scaleSequential((d) => {
      // return d3.interpolateGreens(logScale(d));
      const interpolator = d3.interpolateLab(COLOR_RANGE[0], COLOR_RANGE[1]);
      // const quantized = d3.quantize(interpolator, 5);

      return d ?
        interpolator(logScale(d)) :
        '#ebedf0';
    });

    const startDate = moment().startOf('year').year(year);
    const endDate = startDate.clone().add(1, 'year');

    const months = d3.timeMonths(startDate, endDate);

    const activityMap = {};
    activities.forEach((a) => {
      const dateStr = moment.tz(a.startDate, a.timezone).format('YYYY-MM-DD');
      activityMap[dateStr] = a;
    });

    // Transform the data
    const data = d3.timeDays(startDate, endDate).map((date) => {
      const dateStr = moment(date).format('YYYY-MM-DD');
      const activity = activityMap[dateStr];

      return {
        activity,
        date,
      };
    });

    return (
      <Chart
        className="daily-mileage"
        height={height}
        transform={translate(30, 35)}
        width={width}>
        <g transform={translate(-25, cellSize * .75)}>
          {range(7).map((day) => this._renderDayLabel(day, size))}
        </g>
        {months.map((date) => this._renderMonthLabel(date, size))}
        {data.map((data) => this._renderDay(data, size))}
      </Chart>
    );
  }

  _renderDay = ({activity, date}, size) => {
    const {cellSize} = this.props;

    const m = activity ?
      moment.tz(activity.startDate, activity.timezone) :
      moment(date);

    const distance = (activity && activity.distance) || 0;

    const weekOfYear = d3.timeWeek.count(d3.timeYear(date), date);

    return (
      <OverlayTrigger
        key={m.format()}
        overlay={
          <Tooltip>
            <strong>{m.format('ddd, MMMM Do YYYY')}</strong>
            <br/>
            <Distance distance={distance} />
          </Tooltip>
        }
        placement="top">
        <rect
          style={{
            fill: this._color(distance),
            height: cellSize,
            width: cellSize,
          }}
          x={weekOfYear * size}
          y={m.day() * size}
        />
      </OverlayTrigger>
    );
  }

  _renderDayLabel = (day, size) => {
    return (
      <text
        className="day-label"
        key={day}
        style={labelStyle}
        transform={translate(0, size * day)}>
        {moment().day(day).format('ddd')}
      </text>
    );
  }

  _renderMonthLabel = (date, size) => {
    const m = moment(date);

    // Align the label with the first full week of the month.
    const offset = m.day() === 0 ? 1 : 0;
    const translateX = (m.week() - offset) * size;
    const translateY = -this.props.cellSize * .5;

    return (
      <text
        className="month-label"
        key={m.format()}
        style={labelStyle}
        transform={translate(translateX, translateY)}>
        {m.format('MMM')}
      </text>
    );
  }
}

DailyMileageChart.propTypes = {
  cellSize: PropTypes.number,
  height: PropTypes.number,
  spacing: PropTypes.number,
  width: PropTypes.number,
  year: PropTypes.number.isRequired,
};

DailyMileageChart.defaultProps = {
  cellSize: 10,
  height: 135,
  spacing: 2,
  width: 900,
};

export default DailyMileageChart;
