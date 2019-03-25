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
 * @fileoverview GarminSeries - A datastructure designed to contain a series of
 * GarminSample.
 *
 * @version 1.9
 */

/**
 * Contains a series of samples.  Could represent tracks, routes, waypoints,
 * and many other types of data.
 *
 * @class Garmin.Series
 * @constructor
 * @param (String) type - the type of data this series contain. Should be
 *  determined by what information is recorded by the samples this series
 *  contain.
 */
class GarminSeries {
  constructor(seriesType) {
    this.seriesType = seriesType;
    this.samples = [];
  }

  getSeriesType = () => {
    return this.seriesType;
  }

  setSeriesType = (seriesType) => {
    this.seriesType = seriesType;
  }

  getSamples = () => {
    return this.samples;
  }

  getSample = (index) => {
    let targetSample = null;
    if (index >= 0 && index < this.samples.length) {
      targetSample = this.samples[index];
    }
    return targetSample;
  }

  addSample = (sample) => {
    if (sample != null) {
      this.samples.push(sample);
    }
  }

  getSamplesLength = () => {
    return this.samples.length;
  }

  getFirstValidLocationSample = () => {
    return this.findNearestValidLocationSample(0, 1);
  }

  getLastValidLocationSample = () => {
    return this.findNearestValidLocationSample(this.getSamplesLength() - 1, -1);
  }

  /** Find the nearest valid location point to the index given
   *
   * @param index is the index
   * @param incDirection is an int in the direction we'd like to look positive
   *  nums are forward, negative nums are backwards
   *
   * @type GarminSample
   * @return The nearest point (possibly the index) that has a valid latitude
   * and longitude
   */
  findNearestValidLocationSample = (index, incDirection) => {
    return this._findNearestValidLocationSampleInternal(index, incDirection, 0);
  }

  _findNearestValidLocationSampleInternal = (index, incDirection, count) => {
    const samplesLength = this.getSamplesLength();

    // Make sure we haven't looped through every element already.
    if (samplesLength < 0 || count >= samplesLength) {
      return null;
    }

    // Make sure index requested is within bounds
    if (index >= 0 && index < samplesLength) {
      const sample = this.getSample(index);
      return sample.isValidLocation() ?
        sample :
        this._findNearestValidLocationSampleInternal(
          index + incDirection,
          incDirection,
          ++count /* eslint-disable-line no-plusplus */
        );
    }

    if (index > samplesLength) {
      return this._findNearestValidLocationSampleInternal(
        samplesLength - 1,
        -1,
        count
      );
    }

    return this._findNearestValidLocationSampleInternal(0, 1, count);
  }

  printMe = (tabs) => {
    let output = `${tabs}  [Series]\n`;
    output += `${tabs}    seriesType: ${this.seriesType}\n`;
    output += `${tabs}    samples:\n`;
    for (let i = 0; i < this.samples.length; i++) {
      output += this.samples[i].printMe(`${tabs}    `);
    }
    return output;
  }

  toString = () => {
    return '[Series]';
  }
}

GarminSeries.TYPES = {
  course: 'course',
  history: 'history',
  route: 'route',
  waypoint: 'waypoint',
};

export default GarminSeries;
