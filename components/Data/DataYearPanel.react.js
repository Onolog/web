import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, ButtonGroup, ListGroup, ListGroupItem, Panel } from 'react-bootstrap';

import Distance from '../Distance/Distance.react';
import LeftRight from '../LeftRight/LeftRight.react';
import MonthlyMileageChart from './MonthlyMileageChart.react';
import Topline from '../Topline/Topline.react';
import WeeklyMileageChart from './WeeklyMileageChart.react';

import { getGroupingInfo } from '../../utils/ActivityUtils';

const HEIGHT = 200;
const DAILY = 'daily';
const MONTHLY = 'monthly';
const WEEKLY = 'weekly';

/**
 * ProfileYearPanel.react
 */
class ProfileYearPanel extends React.Component {
  state = {
    selectedGraph: WEEKLY,
  };

  render() {
    return (
      <Panel className="profileYear">
        <Panel.Heading>
          <Panel.Title>
            <LeftRight>
              {this.props.year}
              {this._renderActions()}
            </LeftRight>
          </Panel.Title>
        </Panel.Heading>
        <ListGroup>
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
    const { activities, year } = this.props;

    switch (this.state.selectedGraph) {
      case MONTHLY:
        return (
          <MonthlyMileageChart
            activities={activities}
            height={HEIGHT}
            year={year}
          />
        );
      case WEEKLY:
        return (
          <WeeklyMileageChart
            activities={activities}
            height={HEIGHT}
            year={year}
          />
        );
      case DAILY:
      default:
        return null;
    }
  };

  _renderToplineStats = () => {
    const { activities } = this.props;
    const { activityCount, distance, duration } = getGroupingInfo(activities);
    const m = moment.duration(duration, 's');

    return (
      <Topline>
        <Topline.Item
          annotation={<Distance.Label />}
          label="Distance">
          <Distance distance={distance} label={false} />
        </Topline.Item>
        <Topline.Item label="Activities">
          {activityCount}
        </Topline.Item>
        <Topline.Item label="Time">
          {`${m.days()}d ${m.hours()}h ${m.minutes()}m ${m.seconds()}s`}
        </Topline.Item>
      </Topline>
    );
  };

  _renderActions = () => {
    const { selectedGraph } = this.state;
    return (
      <ButtonGroup bsSize="xsmall" className="chart-type-selector">
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
    this.setState({ selectedGraph });
  };
}

ProfileYearPanel.propTypes = {
  activities: PropTypes.array.isRequired,
  year: PropTypes.number.isRequired,
};

export default ProfileYearPanel;
