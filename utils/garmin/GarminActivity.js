/**
 * Copyright &copy; 2007-2010 Garmin Ltd. or its subsidiaries.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License')
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @fileoverview GarminActivity A data structure representing an activity
 *
 * @version 1.9
 */
import GarminSample from './GarminSample';
import GarminSeries from './GarminSeries';

const ATTRIBUTE_KEYS = {
  activityName: 'activityName',
  activitySport: 'activitySport',
  creatorName: 'creatorName',
  creatorUnitId: 'creatorUnitId',
  creatorProdId: 'creatorProductId',
  creatorVersion: 'creatorVersion',
  dom: 'documentObjectModel',
};

const SUMMARY_KEYS = {
  avgHeartRate: 'averageHeartRate',
  calories: 'calories',
  endTime: 'endTime',
  intensity: 'intensity',
  maxHeartRate: 'maximumHeartRate',
  maxSpeed: 'maximumSpeed',
  startTime: 'startTime',
  totalDistance: 'totalDistance',
  totalTime: 'totalTime',
};

const SECTION_KEYS = {
  gpsSignals: 'gpsSignal',
  heartRateSignals:	'heartRateSignal',
  laps: 'laps',
  tracks: 'tracks',
};

/**
 * A data structure for storing data commonly found in various
 * formats supported by various gps devices.  Some examples are
 * gpx track, gpx route, gpx wayoint, and tcx activity.
 *
 * @class GarminActivity
 * @constructor
 */
class GarminActivity {
  attributes = {};
  laps = [];
  series = [];
  summary = new GarminSample();

  getAttributes = () => {
    return this.attributes;
  }

  getAttribute = (aKey) => {
    return this.attributes[aKey];
  }

  setAttribute = (aKey, aValue) => {
    this.attributes[aKey] = aValue;
  }

  addLap = (lap) => {
    this.laps.push(lap);
  }

  getLaps = () => {
    return this.laps;
  }

  getSeries = () => {
    return this.series;
  }

  getHistorySeries = () => {
    for (let i = 0; i < this.series.length; i++) {
      if (this.series[i].getSeriesType() === GarminSeries.TYPES.history) {
        return this.series[i];
      }
    }
    return null;
  }

  addSeries = (series) => {
    this.series.push(series);
  }

  getSingleSeries = (index) => {
    let targetSeries = null;
    if (index >= 0 && index < this.series.length) {
      targetSeries = this.series[index];
    }
    return targetSeries;
  }

  getSummary = () => {
    return this.summary;
  }

  getSummaryValue = (sKey) => {
    return this.summary.getMeasurement(sKey);
  }

  setSummaryValue = (sKey, sValue, sContext) => {
    this.summary.setMeasurement(sKey, sValue, sContext);
  }

  getDeviceName = () => {
    return this.getAttribute(ATTRIBUTE_KEYS.creatorName);
  }

  getDeviceProductID = () => {
    return this.getAttribute(ATTRIBUTE_KEYS.creatorProdId);
  }

  getSoftwareVersionString = () => {
    var v = this.getAttribute(ATTRIBUTE_KEYS.creatorVersion);
    return v && [
      v.versionMajor,
      v.versionMinor,
      v.buildMajor,
      v.buildMinor,
    ].join('.');
  }

  getActivityType = () => {
    return this.getAttribute(ATTRIBUTE_KEYS.activitySport);
  }

  getAvgHeartRate = () => {
    return this._getValue(SUMMARY_KEYS.avgHeartRate);
  }

  getCalories = () => {
    return this._getValue(SUMMARY_KEYS.calories);
  }

  /**
   * Returns a string with the total duration formatted as "hh:mm:ss"
   */
  getDuration = () => {
    return this.getStartTime().getDurationTo(this.getEndTime());
  }

  getElevationGain = () => {
    return this._getValue(SUMMARY_KEYS.elevationGain);
  }

  getEndTime = () => {
    return this._getValue(SUMMARY_KEYS.endTime);
  }

  getIntensity = () => {
    return this._getValue(SUMMARY_KEYS.intensity);
  }

  getMaxHeartRate = () => {
    return this._getValue(SUMMARY_KEYS.maxHeartRate);
  }

  getMaxSpeed = () => {
    return this._getValue(SUMMARY_KEYS.maxSpeed);
  }

  getActivityName = () => {
    return this.getAttribute(ATTRIBUTE_KEYS.activityName);
  }

  getStartTime = () => {
    return this._getValue(SUMMARY_KEYS.startTime);
  }

  getTotalDistance = () => {
    return this._getValue(SUMMARY_KEYS.totalDistance);
  }

  /**
   * Returns the total time for the activity in seconds
   */
  getTotalTime = () => {
    var startTime = this.getStartTime().getDate().getTime();
    var endTime = this.getEndTime().getDate().getTime();
    return (endTime - startTime) / 1000;
  }

  _getValue = (/*string*/ key) /*?any*/ => {
    var summaryValue = this.getSummaryValue(key);
    return summaryValue && summaryValue.getValue();
  }

  printMe = (tabs) => {
    let output = '';
    output += `${tabs}\n\n[Activity]\n`;

    output += tabs + '  attributes:\n';
    var attKeys = Object.keys(this.attributes);
    for (let ii = 0; ii < attKeys.length; ii++) {
      output += `${tabs}    ${attKeys[ii]}: ${this.attributes[attKeys[ii]]}\n`;
    }

    output += `${tabs}  summary:\n`;
    output += this.summary.printMe(tabs + '  ');
    output += `${tabs}  series:\n`;

    for (let jj = 0; jj < this.series.length; jj++) {
      output += this.series[jj].printMe(tabs + '  ');
    }

    return output;
  }

  toString = () => {
    return '[GarminActivity]';
  }
}

GarminActivity.ATTRIBUTE_KEYS = ATTRIBUTE_KEYS;
GarminActivity.SECTION_KEYS = SECTION_KEYS;
GarminActivity.SUMMARY_KEYS = SUMMARY_KEYS;

export default GarminActivity;
