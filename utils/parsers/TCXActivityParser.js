import XMLParser from './XMLParser';

import {flatten, forEach, head, map, max, reduce} from 'lodash';

import {TCX_SCHEMA_TAGS} from '../../constants/Garmin';
const TAGS = TCX_SCHEMA_TAGS;

/**
 * TCXActivityParser
 *
 * Parses an individual activity from a TCX file and returns a JavaScript object
 * with the data.
 */
class TCXActivityParser extends XMLParser {
  constructor(node) {
    super(node);

    this.parseLap = this.parseLap.bind(this);
    this.parseTrack = this.parseTrack.bind(this);
    this.parseTrackpoint = this.parseTrackpoint.bind(this);

    this.laps = [];
    this.tracks = [];
  }

  parse() {
    // Parse each lap in the activity.
    forEach(this.getByTagName(TAGS.lap), this.parseLap);

    // Parse each track and trackpoint.
    forEach(this.getByTagName(TAGS.track), this.parseTrack);

    var elevationChange = this._getElevationChange();

    return {
      activity_type: this.getAttribute(TAGS.activitySport),
      start_date: this.getTagValue(TAGS.activityId, this.node),
      timezone: '', // Get timezone based on lat/long?
      distance: this._getTotal('distance'),
      duration: +this._getTotal('duration').toFixed(),
      avg_hr: this._getAvgHeartRate(),
      max_hr: this._getMax('max_hr'),
      elevation_gain: elevationChange.gain,
      elevation_loss: elevationChange.loss,
      calories: this._getTotal('calories'),
      device: this.parseDevice(),
      laps: this.laps,
      tracks: flatten(this.tracks),
    };
  }

  parseLap(lapNode, idx) {
    var avgHrNode = head(lapNode.getElementsByTagName(
      TAGS.lapAverageHeartRate
    ));
    var maxHrNode = head(lapNode.getElementsByTagName(
      TAGS.lapMaxHeartRate
    ));

    this.laps.push({
      avg_hr: this.getTagValue('Value', avgHrNode),
      calories: this.getTagValue(TAGS.lapCalories, lapNode),
      distance: this.getTagValue(TAGS.lapDistance, lapNode),
      duration: this.getTagValue(TAGS.lapTotalTime, lapNode),
      elevation_change: this.getTagValue(TAGS.lapElevationChange, lapNode),
      intensity: this.getTagValue(TAGS.lapIntensity, lapNode),
      lap: idx + 1, // Lap #
      lap_start_time: lapNode.getAttribute(TAGS.lapStartTime),
      max_hr: this.getTagValue('Value', maxHrNode),
      max_speed: this.getTagValue(TAGS.lapMaxSpeed, lapNode),
    });
  }

  parseTrack(trackNode) {
    var track = [];
    var trackpointNodes = trackNode.getElementsByTagName(TAGS.trackPoint);

    forEach(trackpointNodes, (trackpointNode) => {
      let point = this.parseTrackpoint(trackpointNode);
      if (point) {
        track.push(point);
      }
    });

    track.length && this.tracks.push(track);
  }

  parseTrackpoint(trackpointNode) {
    const lat = +this.getTagValue(TAGS.positionLatitude, trackpointNode);
    const lng = +this.getTagValue(TAGS.positionLongitude, trackpointNode);

    // Omit trackpoints without lat/lng values.
    if (!(lat && lng)) {
      return null;
    }

    return {
      altitude: this.getTagValue(TAGS.trackPointElevation, trackpointNode),
      distance: this.getTagValue(TAGS.trackPointDistance, trackpointNode),
      lat,
      lng,
      speed: this.getTagValue('Speed', trackpointNode),
      time: this.getTagValue(TAGS.trackPointTime, trackpointNode),
    };
  }

  /**
   * Returns info for the device that created the activity, if present.
   */
  parseDevice() /*object*/ {
    var deviceNode = head(this.getByTagName(TAGS.creator));
    if (!deviceNode) {
      return;
    }

    var version = [
      this.getTagValue(TAGS.versionMajor, deviceNode),
      this.getTagValue(TAGS.versionMinor, deviceNode),
      this.getTagValue(TAGS.versionBuildMajor, deviceNode),
      this.getTagValue(TAGS.versionBuildMinor, deviceNode),
    ].join('.');

    return {
      name: this.getTagValue(TAGS.creatorName, deviceNode),
      product_id: this.getTagValue(TAGS.creatorProductID, deviceNode),
      unit_id: this.getTagValue(TAGS.creatorUnitID, deviceNode),
      version: version,
    };
  }

  // TODO: Is this an accurate calculation?
  _getAvgHeartRate() /*number*/ {
    var total = this._getTotal('avg_hr') || 0;

    // Round to the nearest whole bpm.
    return +(total / this.laps.length).toFixed();
  }

  /**
   * Calculates total positive and negative elevation gain for the activity.
   */
  _getElevationChange() /*object*/ {
    var altitudeValues = map(flatten(this.tracks), 'altitude');
    var change;
    var elevationGain = [];
    var elevationLoss = [];

    // Loop through all the altitude values and separate the elevation changes.
    // Start with the second value, since we need the previous value to
    // calculate change.
    for (var ii=1; ii < altitudeValues.length; ii++) {
      // Change is the current elevation minus the previous elevation.
      change = altitudeValues[ii] - altitudeValues[ii-1] || 0;

      // Make sure the values are valid.
      if (change > 0) {
        elevationGain.push(change);
      } else {
        elevationLoss.push(change);
      }
    }

    return {
      gain: reduce(elevationGain, (total, value) => total + value, 0),
      loss: reduce(elevationLoss, (total, value) => total + value, 0),
    };
  }

  /**
   * Gets the maximum value for the given field.
   */
  _getMax(/*string*/ keyName) /*number*/ {
    return +max(map(this.laps, keyName)) || 0;
  }

  /**
   * Calculates the sum total for the given field.
   */
  _getTotal(/*string*/ keyName) /*number*/ {
    return map(this.laps, keyName).reduce((total, value) => {
      value = value || 0;
      return +value + total;
    }, 0);
  }
}

module.exports = TCXActivityParser;
