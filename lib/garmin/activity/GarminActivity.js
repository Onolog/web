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
var GarminSample = require('./GarminSample');
var GarminSeries = require('./GarminSeries');

var ATTRIBUTE_KEYS = {
	activityName: "activityName",
	activitySport: "activitySport",
	creatorName: "creatorName",
	creatorUnitId: "creatorUnitId",
	creatorProdId: "creatorProductId",
	creatorVersion: "creatorVersion",
	dom: "documentObjectModel"
};

var SUMMARY_KEYS = {
	avgHeartRate: "averageHeartRate",
	calories: "calories",
	endTime: "endTime",
	intensity: "intensity",
	maxHeartRate: "maximumHeartRate",
	maxSpeed: "maximumSpeed",
	startTime: "startTime",
	totalDistance: "totalDistance",
	totalTime: "totalTime"
};

var SECTION_KEYS = {
	gpsSignals: "gpsSignal",
	heartRateSignals:	"heartRateSignal",	
	laps: "laps",
	tracks: "tracks"
};

/**
 * A data structure for storing data commonly found in various
 * formats supported by various gps devices.  Some examples are
 * gpx track, gpx route, gpx wayoint, and tcx activity.
 *
 * @class GarminActivity
 * @constructor 
 */
var GarminActivity = function() {
  this.attributes = {};
  this.laps = [];
  this.summary = new GarminSample();
  this.series = [];
};

GarminActivity.prototype = {
	getAttributes: function() {
		return this.attributes;
	},
	
	getAttribute: function(aKey) {
		return this.attributes[aKey];
	},
	
	setAttribute: function(aKey, aValue) {
		this.attributes[aKey] = aValue;
	},

  addLap: function(lap) {
    this.laps.push(lap);
  },

  getLaps: function() {
    return this.laps;
  },
	
	getSeries: function() {
		return this.series;
	},
	
	getHistorySeries: function() {
		for (var i = 0; i < this.series.length; i++) {
			if (this.series[i].getSeriesType() == GarminSeries.TYPES.history) {
				return this.series[i];
			}
		}
		return null;
	},
	
	addSeries: function(series) {
		this.series.push(series);
	},
	
	getSingleSeries: function(index) {
		var targetSeries = null;
		if (index >= 0 && index < this.series.length) {
			targetSeries = this.series[index];
		}
		return targetSeries;
	},
	
	getSummary: function() {
		return this.summary;
	},
	
	getSummaryValue: function(sKey) {
		return this.summary.getMeasurement(sKey);
	},
	
	setSummaryValue: function(sKey, sValue, sContext) {
		this.summary.setMeasurement(sKey, sValue, sContext);
	},

  getDeviceName: function() {
    return this.getAttribute(ATTRIBUTE_KEYS.creatorName);
  },

  getDeviceProductID: function() {
    return this.getAttribute(ATTRIBUTE_KEYS.creatorProdId);
  },

  getSoftwareVersionString: function() {
    var v = this.getAttribute(ATTRIBUTE_KEYS.creatorVersion);
    return v && [
      v.versionMajor,
      v.versionMinor,
      v.buildMajor,
      v.buildMinor
    ].join('.');
  },

  getActivityType: function() {
    return this.getAttribute(ATTRIBUTE_KEYS.activitySport);
  },

  getAvgHeartRate: function() /*number*/ {
    return this._getValue(SUMMARY_KEYS.avgHeartRate);
  },

  getCalories: function() /*number*/ {
    return this._getValue(SUMMARY_KEYS.calories);
  },

  /**
   * Returns a string with the total duration formatted as "hh:mm:ss"
   */
  getDuration: function() /*string*/ {
    return this.getStartTime().getDurationTo(this.getEndTime());
  },

  getElevationGain: function() /*number*/ {
    return this._getValue(SUMMARY_KEYS.elevationGain);
  },

	getEndTime: function() {
		return this._getValue(SUMMARY_KEYS.endTime);
	},

	getIntensity: function() {
		return this._getValue(SUMMARY_KEYS.intensity);
	},

	getMaxHeartRate: function() {
		return this._getValue(SUMMARY_KEYS.maxHeartRate);
	},

	getMaxSpeed: function() {
		return this._getValue(SUMMARY_KEYS.maxSpeed);
	},

	getActivityName: function() {
    return this.getAttribute(ATTRIBUTE_KEYS.activityName)
	},
	
	getStartTime: function() {
		return this._getValue(SUMMARY_KEYS.startTime);
	},

	getTotalDistance: function() {
		return this._getValue(SUMMARY_KEYS.totalDistance);
	},

  /**
   * Returns the total time for the activity in seconds
   */
  getTotalTime: function() /*number*/ {
    var startTime = this.getStartTime().getDate().getTime();
    var endTime = this.getEndTime().getDate().getTime();
    return (endTime - startTime) / 1000;
  },

  _getValue: function(/*string*/ key) /*?any*/ {
    var summaryValue = this.getSummaryValue(key);
    return summaryValue && summaryValue.getValue();
  },

	printMe: function(tabs) {
		var output = "";
		output += tabs + "\n\n[Activity]\n";
		
		output += tabs + "  attributes:\n";
		var attKeys = Object.keys(this.attributes);
		for (var i = 0; i < attKeys.length; i++) {
			output += tabs + "    " + attKeys[i] + ": " + this.attributes[attKeys[i]] + "\n"; 
		}
		
		output += tabs + "  summary:\n";
		output += this.summary.printMe(tabs + "  ");

		output += tabs + "  series:\n";		
		for (var i = 0; i < this.series.length; i++) {
			output += this.series[i].printMe(tabs + "  ");
		}
		
		return output;
	},
	
	toString: function() {
		return "[GarminActivity]"
	}
};

GarminActivity.ATTRIBUTE_KEYS = ATTRIBUTE_KEYS;
GarminActivity.SECTION_KEYS = SECTION_KEYS;
GarminActivity.SUMMARY_KEYS = SUMMARY_KEYS;

module.exports = GarminActivity;
