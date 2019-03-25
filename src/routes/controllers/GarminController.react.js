import { head } from 'lodash';
import moment from 'moment';
import { Panel } from 'react-bootstrap';
import React from 'react';

import Activity from '../../components/Activities/Activity.react';
import AppFullPage from '../../components/Page/AppFullPage.react';
import EmptyState from '../../components/EmptyState.react';
import FileInput from '../../components/Forms/FileInput.react';

import { metersToFeet, metersToMiles } from '../../utils/distanceUtils';
import FileParser from '../../utils/parsers/FileParser';
import GoogleTimezone from '../../utils/GoogleTimezone';

/**
 * GarminUploader.react
 */
class GarminUploader extends React.Component {
  state = {
    activity: null,
  };

  render() {
    const { activity } = this.state;
    const athlete = {
      id: 517820043,
      name: 'Eric Giovanola',
    };
    const shoes = {
      id: 41,
      name: 'ASICS DS Trainer 19.2',
    };

    const contents = activity ?
      <Activity
        activity={this._normalizeActivity(activity)}
        athlete={athlete}
        fill
        shoes={shoes}
      /> :
      <EmptyState>
        No activity to display. Please upload a file.
      </EmptyState>;

    return (
      <AppFullPage>
        <Panel>
          <Panel.Heading>
            <Panel.Title>Choose a .tcx file</Panel.Title>
          </Panel.Heading>
          <Panel.Body>
            <FileInput onChange={this._handleChange} />
          </Panel.Body>
        </Panel>
        <Panel>
          {contents}
        </Panel>
      </AppFullPage>
    );
  }

  /**
   * Convert a Garmin activity to the standardized format.
   */
  _normalizeActivity = (activity) => {
    const friends = [
      4280,
      700963,
      509191417,
    ].join(',');

    const notes =
      'Long run in Wunderlich Park with Sonderby, Turner, and Laney. ' +
      'Felt pretty good, probably pushed a bit too hard. HR was over ' +
      '153 most of the time. Felt a little beat up by the end, but ' +
      'overall pretty good recovery long run after Way Too Cool.' +
      '\n\n' +
      'http://connect.garmin.com/modern/activity/719673604';

    return {
      ...activity,
      distance: metersToMiles(activity.distance),
      elevationGain: metersToFeet(activity.elevationGain),
      elevationLoss: metersToFeet(activity.elevationLoss),
      friends,
      id: 0,
      notes,
      startDate: moment(activity.startDate).format(),
    };
  };

  _handleChange = (e) => {
    const { files } = e.target;
    const reader = new FileReader();

    reader.onloadend = this._onLoadEnd;
    reader.readAsText(files[0]);
  };

  _onLoadEnd = (e) => {
    if (e.target.readyState === FileReader.DONE) {
      const parser = new FileParser();
      const activities = parser.parse(e.target.result);

      // We currently only upload one file at a time
      const activity = head(activities);
      const start = activity.tracks[0];

      // Get the timezone from the activity's geodata.
      GoogleTimezone({
        latitude: start.lat,
        longitude: start.lng,
        timestamp: moment(start.time).unix(),
      }, (data) => {
        activity.timezone = data.timeZoneId;
        this.setState({ activity });
      });
    }
  };
}

export default GarminUploader;
