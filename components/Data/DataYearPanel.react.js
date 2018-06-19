import * as d3 from 'd3';
import {map} from 'lodash';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import {Button, ButtonGroup, ListGroup, ListGroupItem, Panel} from 'react-bootstrap';

import BarChart from './BarChart.react';
import Distance from '../Distance/Distance.react';
import LeftRight from '../LeftRight/LeftRight.react';
import Topline from '../Topline/Topline.react';
import WeeklyMileageChart from './WeeklyMileageChart.react';

import {getGroupingInfo, getAggregateDistance, groupActivities} from '../../utils/ActivityUtils';

const HEIGHT = 200;
const DAILY = 'daily';
const MONTHLY = 'monthly';
const WEEKLY = 'weekly';

/**
 * ProfileYearPanel.react
 */
class ProfileYearPanel extends React.Component {
  static displayName = 'ProfileYearPanel';

  static propTypes = {
    activities: PropTypes.array.isRequired,
    year: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]).isRequired,
  };

  state = {
    selectedGraph: WEEKLY,
  };

  render() {
    return (
      <Panel
        className="profileYear"
        header={
          <h3>
            <LeftRight>
              {this.props.year}
              {this._renderActions()}
            </LeftRight>
          </h3>
        }>
        <ListGroup fill>
          <ListGroupItem>
            {this._renderChart()}
          </ListGroupItem>
          <ListGroupItem>
            {this._renderToplineStats()}
          </ListGroupItem>
        </ListGroup>
      </Panel>
    );
  }

  _renderChart = () => {
    const {activities, year} = this.props;

    let groupedActivities;
    let tooltip;
    let xFormat;

    switch (this.state.selectedGraph) {
      case MONTHLY:
        groupedActivities = groupActivities.byMonth(activities);
        tooltip = (data) => (`
          ${moment().month(data.xVal).year(year).format('MMMM YYYY')}
          <div>${data.yVal} miles</div>
        `);
        xFormat = (m) => moment().month(m).format('MMM');
        break;
      case WEEKLY:
        const data = d3.nest()
          .key((d) => moment.tz(d.startDate, d.timezone).week())
          .rollup((values) => d3.sum(values, (v) => v.distance))
          .entries(activities);

        return (
          <WeeklyMileageChart
            data={data}
            height={HEIGHT}
            year={year}
          />
        );
      case DAILY:
        groupedActivities = groupActivities.byDay(activities);
        break;
    }

    const data = map(groupedActivities, (activities, idx) => {
      return {
        xVal: idx,
        yVal: getAggregateDistance(activities),
      };
    });

    return (
      <BarChart
        data={data}
        height={HEIGHT}
        tooltip={tooltip}
        xFormat={xFormat}
      />
    );
  };

  _renderToplineStats = () => {
    const {activities} = this.props;
    const {activity_count, distance, duration} = getGroupingInfo(activities);
    const m = moment.duration(duration, 's');

    return (
      <Topline>
        <Topline.Item
          annotation={<Distance.Label />}
          label="Distance">
          <Distance distance={distance} label={false} />
        </Topline.Item>
        <Topline.Item label="Activities">
          {activity_count}
        </Topline.Item>
        <Topline.Item label="Time">
          {`${m.days()}d ${m.hours()}h ${m.minutes()}m ${m.seconds()}s`}
        </Topline.Item>
      </Topline>
    );
  };

  _renderActions = () => {
    const {selectedGraph} = this.state;
    return (
      <ButtonGroup bsSize="xsmall" className="chart-type-selector">
        {/*
        <Button
          active={selectedGraph === DAILY}
          onClick={() => this._onChartTypeClick(DAILY)}>
          Daily
        </Button>
        */}
        <Button
          active={selectedGraph === WEEKLY}
          onClick={() => this._onChartTypeClick(WEEKLY)}>
          Weekly
        </Button>
        <Button
          active={selectedGraph === MONTHLY}
          onClick={() => this._onChartTypeClick(MONTHLY)}>
          Monthly
        </Button>
      </ButtonGroup>
    );
  };

  _onChartTypeClick = (selectedGraph) => {
    this.setState({selectedGraph});
  };
}

export default ProfileYearPanel;
