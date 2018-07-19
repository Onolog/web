import React from 'react';
import {Panel} from 'react-bootstrap';

import ActivityChart from '../../components/Data/ActivityChart.react';
import AppPage from '../../components/Page/AppPage.react';
import DailyMileageChart from '../../components/Data/DailyMileageChart.react';
import MonthlyMileageChart from '../../components/Data/MonthlyMileageChart.react';
import PageHeader from '../../components/Page/PageHeader.react';
import WeeklyMileageChart from '../../components/Data/WeeklyMileageChart.react';

import {metersToFeet, metersToMiles} from '../../utils/distanceUtils';
import speedToPace from '../../utils/speedToPace';

import '../../components/Data/css/charts.scss';

import {METRICS} from '../../constants/Garmin';
import {ACTIVITIES, ACTIVITY_METRICS} from '../../constants/TestData';

const HEIGHT = 200;

// TODO: Include timezone in fetched + test data.
const activities = ACTIVITIES.map((a) => ({
  ...a,
  timezone: 'America/Los_Angeles',
}));

const activityData = ACTIVITY_METRICS.map(({metrics}) => {
  const distance = metersToMiles(metrics[METRICS.SUM_DISTANCE]);
  const pace = speedToPace(metrics[METRICS.SPEED]);

  return {
    distance,
    elevation: metersToFeet(metrics[METRICS.ELEVATION]),
    hr: metrics[METRICS.HEART_RATE],
    lat: metrics[METRICS.LATITUDE],
    lng: metrics[METRICS.LONGITUDE],
    pace: pace > 960 ? 960 : pace, // Compress outlying data,
  };
});

const year = (new Date(activities[0].startDate)).getFullYear();

/**
 * ChartController.react
 *
 * Static page for testing data & charting libs.
 */
class ChartController extends React.Component {
  render() {
    return (
      <AppPage>
        <PageHeader title="Data" />
        <Panel>
          <Panel.Heading>
            <Panel.Title>Daily Data</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <DailyMileageChart
              activities={activities}
              height={150}
              year={year}
            />
          </Panel.Body>
        </Panel>
        <Panel>
          <Panel.Heading>
            <Panel.Title>Monthly Data</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <MonthlyMileageChart
              activities={activities}
              height={HEIGHT}
              year={year}
            />
          </Panel.Body>
        </Panel>
        <Panel>
          <Panel.Heading>
            <Panel.Title>Weekly Data</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <WeeklyMileageChart
              activities={activities}
              height={HEIGHT}
              year={year}
            />
          </Panel.Body>
        </Panel>
        <Panel>
          <Panel.Body>
            <ActivityChart data={activityData} />
          </Panel.Body>
        </Panel>
      </AppPage>
    );
  }
}

module.exports = ChartController;
