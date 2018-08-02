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
 * @fileoverview GarminSample - A datastructure designed to contain a number of
 * measurements recorded at a single point.
 * @version 1.9
 */

import GarminMeasurement from './GarminMeasurement';

const MEASUREMENT_KEYS = {
  cadence: 'cadence',
  distance: 'distance',
  elevation: 'elevation',
  heartRate: 'heartRate',
  latitude: 'latitude',
  longitude: 'longitude',
  sensorState: 'sensorState',
  time: 'time',
};

/**
 * A collection of measurements recorded at a single point.
 *
 * @class GarminSample
 * @constructor
 */
class GarminSample {
  dom = null;
  factory = null;
  isLazyLoaded = false; // Lazy loading related values
  measurements = {};    // Measurements of this sample

  setLazyLoading = (isLazyLoaded, factory, dom) => {
    this.isLazyLoaded = isLazyLoaded;
    this.factory = factory;
    this.dom = dom;
  }

  getMeasurements = () => {
    this.finishLoading();
    return this.measurements;
  }

  getMeasurement = (mKey) => {
    this.finishLoading();
    return this.measurements[mKey];
  }

  getMeasurementValue = (mKey) => {
    this.finishLoading();
    return this.measurements[mKey] ?
      this.measurements[mKey].getValue() :
      null;
  }

  getMeasurementContext = (mKey) => {
    this.finishLoading();
    return this.measurements[mKey] ?
      this.measurements[mKey].getContext() :
      null;
  }

  getElevation = () => {
    return this.getMeasurementValue(MEASUREMENT_KEYS.elevation);
  }

  getLatitude = () => {
    return this.getMeasurementValue(MEASUREMENT_KEYS.latitude);
  }

  getLongitude = () => {
    return this.getMeasurementValue(MEASUREMENT_KEYS.longitude);
  }

  getTime = () => {
    return this.getMeasurementValue(MEASUREMENT_KEYS.time);
  }

  setMeasurement = (mKey, mValue, mContext) => {
    // if the key does not exist or is not of type GarminMeasurement, create a
    // new measurement object else overwrite existing value and context
    if (
      !this.measurements[mKey] ||
      !(this.measurements[mKey] instanceof GarminMeasurement)
    ) {
      this.measurements[mKey]= new GarminMeasurement(mValue, mContext);
    } else {
      this.measurements[mKey].setValue(mValue);
      this.measurements[mKey].setContext(mContext);
    }
  }

  /** Determines if this Sample is valid for determing location
   * @type Boolean
   * @return True if latitude and longitude exist, false otherwise
   */
  isValidLocation = () => {
    var latitude = this.getMeasurement(MEASUREMENT_KEYS.latitude);
    var longitude = this.getMeasurement(MEASUREMENT_KEYS.longitude);
    return (
      (latitude && latitude.getValue() !== null) &&
      (longitude && longitude.getValue() !== null)
    );
  }

  /**
   * Finish loading the measurements for this sample if previously lazy-loaded.
   */
  finishLoading = () => {
    if (this.isLazyLoaded) {
      this.factory.finishLoadingSample(this.dom, this);
    }
  }

  printMe = (tabs) => {
    let output = '';
    output += tabs + '  [Sample]\n';

    let measKeys = Object.keys(this.measurements);
    for (let i = 0; i < measKeys.length; i++) {
      output += tabs + '    ' + measKeys[i] + ':\n';
      output += this.measurements[measKeys[i]].printMe(tabs + '    ');
    }

    return output;
  }

  toString() {
    return '[GarminSample]';
  }
}

GarminSample.MEASUREMENT_KEYS = MEASUREMENT_KEYS;

export default GarminSample;
