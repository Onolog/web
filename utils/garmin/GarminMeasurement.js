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
 * @fileoverview Garmin.Measurement - A datastructure designed to contain a
 * single data measurement.
 * @version 1.9
 */

/**
 * Represent a real measurement.
 * @class Garmin.Measurement
 * @constructor
 * @param value - value of the measurement
 * @param context - the context of the measurement (feet, seconds, etc...)
 */
class GarminMeasurement {
  constructor(value, context) {
    this.value = value;
    this.context = context;
  }

  getContext = () => {
    return this.context;
  }

  setContext = (context) => {
    this.context = context;
  }

  getValue = () => {
    return this.value;
  }

  setValue = (value) => {
    this.value = value;
  }

  printMe = (tabs) => {
    var output = '';
    output += tabs + ' [Measurement]\n';
    output += tabs + ' value: ' + this.value + '\n';
    //output += tabs + "    context: " + this.context + '\n';
    return output;
  }

  toString = () => {
    return `${this.value} ${this.context}`;
  }
}

export default GarminMeasurement;
