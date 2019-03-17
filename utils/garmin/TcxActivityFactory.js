/* eslint-disable max-len */

import moment from 'moment';

import GarminActivity from './GarminActivity';
import GarminSample from './GarminSample';
import GarminSeries from './GarminSeries';
import XmlConverter from './XmlConverter';

const { ATTRIBUTE_KEYS } = GarminActivity;
const { MEASUREMENT_KEYS } = GarminSample;
const DETAIL = {
  creator: 'Garmin Communicator Plugin API - http://www.garmin.com/',
};
const SCHEMA_TAGS = {
  activities: 'Activities',
  activity: 'Activity',
  activityId: 'Id',
  activitySport: 'Sport',
  author: 'Author',
  course: 'Course',
  courseName: 'Name',
  courses: 'Courses',
  creator: 'Creator',
  creatorName: 'Name',
  creatorProductID: 'ProductID',
  creatorUnitID: 'UnitId',
  elevationGain: 'ElevationGain',
  lap: 'Lap',
  lapAverageHeartRate: 'AverageHeartRateBpm',
  lapCadence: 'Cadence',
  lapCalories: 'Calories',
  lapDistance: 'DistanceMeters',
  lapElevationChange: 'ElevationChange',
  lapIntensity: 'Intensity',
  lapMaxHeartRate: 'MaximumHeartRateBpm',
  lapMaxSpeed: 'MaximumSpeed',
  lapNotes: 'Notes',
  lapStartTime: 'StartTime',
  lapTotalTime: 'TotalTimeSeconds',
  lapTriggerMethod: 'TriggerMethod',
  multiSportSession: 'MultiSportSession',
  nextSport: 'NextSport',
  position: 'Position',
  positionLatitude: 'LatitudeDegrees',
  positionLongitude: 'LongitudeDegrees',
  track: 'Track',
  trackPoint: 'Trackpoint',
  trackPointCadence: 'Cadence',
  trackPointDistance: 'DistanceMeters',
  trackPointElevation: 'AltitudeMeters',
  trackPointHeartRate: 'HeartRateBpm',
  trackPointHeartRateValue: 'Value',
  trackPointSensorState: 'SensorState',
  trackPointTime: 'Time',
  version: 'Version',
  versionBuildMajor: 'BuildMajor',
  versionBuildMinor: 'BuildMinor',
  versionMajor: 'VersionMajor',
  versionMinor: 'VersionMinor',
};

const { SUMMARY_KEYS } = GarminActivity;

/**
 * TcxActivityFactory
 *
 * Parses Garmin TCX files and produces a Garmin Activity object.
 */
class TcxActivityFactory {
  parseString = (tcxString) => {
    const tcxDocument = XmlConverter.toDocument(tcxString);
    return this.parseDocument(tcxDocument);
  }

  /* Creates and returns an array of activities from the document. */
  parseDocument = (tcxDocument) => {
    if (
      !tcxDocument.getElementsByTagName(SCHEMA_TAGS.activities).length &&
      !tcxDocument.getElementsByTagName(SCHEMA_TAGS.courses).length
    ) {
      // Not TCX parseable
      throw new Error('Error: Unable to parse TCX document.');
    }

    const activities = tcxDocument.getElementsByTagName(SCHEMA_TAGS.activity);
    const tracks = tcxDocument.getElementsByTagName(SCHEMA_TAGS.track);
    const courses = tcxDocument.getElementsByTagName(SCHEMA_TAGS.course);
    const laps = tcxDocument.getElementsByTagName(SCHEMA_TAGS.lap);

    // Activities
    if (activities.length) {
      return tracks.length ?
        // Complete activity
        this._parseTcxActivities(tcxDocument) :
        // Directory listing
        this._parseTcxHistoryDirectory(tcxDocument);
    }

    // Courses
    if (courses.length) {
      return laps.length ?
        // Complete course
        this._parseTcxCourses(tcxDocument) :
        // Directory listing
        this._parseTcxCourseDirectory(tcxDocument);
    }
  }

  produceString = (activities) => {
    const locations = [
      'http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2',
      'http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd',
      'http://www.garmin.com/xmlschemas/FatCalories/v1',
      'http://www.garmin.com/xmlschemas/fatcalorieextensionv1.xsd',
    ];

    // Header tags
    let tcxString =
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>\n' +
      '<TrainingCenterDatabase ' +
        'xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        `xsi:schemaLocation="${locations.join(' ')}">\n` +
      '<Activities>';

    if (activities != null && activities.length > 0) {
      // activity tags
      for (let i = 0; i < activities.length; i++) {
        tcxString += `\n    ${this._produceActivityString(activities[i])}`;
      }
      tcxString += '\n  </Activities>';

      // author tag
      const activityDom = activities[0].getAttribute(ATTRIBUTE_KEYS.dom);
      if (activityDom) {
        const authorDom =
          activityDom.ownerDocument.getElementsByTagName(SCHEMA_TAGS.author);
        if (authorDom.length) {
          tcxString += `\n  ${XmlConverter.toString(authorDom[0])}`;
        }
      }
    }

    // footer tags
    tcxString += '\n</TrainingCenterDatabase>';

    return tcxString;
  }

  /**
   * Fully load the sample, assume sample was previously lazy-loaded.
   */
  finishLoadingSample = (domNode, sample) => {
    this._parseTcxTrackPoint(domNode, sample);
    sample.isLazyLoaded = false;
  }

  _produceActivityString = (activity) => {
    let activityString = '';

    if (activity != null) {
      // converting the dom back into string
      // this is the lazy way, this will not work if
      // converting between file types or activity data
      // has been modified.
      const activityDom = activity.getAttribute(ATTRIBUTE_KEYS.dom);
      if (activityDom != null) {
        activityString = XmlConverter.toString(activityDom);
      }
    }

    return activityString;
  }

  _parseTcxHistoryDirectory = (tcxDocument) => {
    const activities = [];

    // Grab the activity/course nodes, depending on document
    const activityNodes =
      tcxDocument.getElementsByTagName(SCHEMA_TAGS.activity);

    // loop through all activities in the document
    for (let i = 0; i < activityNodes.length; i++) {
      if (activityNodes[i].parentNode.tagName !== SCHEMA_TAGS.nextSport) {
        // create new activity object
        const activity = this._parseTcxActivity(
          activityNodes[i],
          SCHEMA_TAGS.activity
        );

        // grab all the lap nodes in the dom
        const lapNodes = activityNodes[i].getElementsByTagName(SCHEMA_TAGS.lap);

        // grab start time from the first lap and set duration to 0
        let activityDurationMS = 0; // in ms
        let activityStartTimeMS;

        if (lapNodes.length) {
          activityStartTimeMS =
            lapNodes[0].getAttribute(SCHEMA_TAGS.lapStartTime);
        }

        // loop through all laps in this activity
        for (let jj = 0; jj < lapNodes.length; jj++) {
          // Update the duration of this activity
          const lapTotalTime = this._tagValue(
            lapNodes[jj],
            SCHEMA_TAGS.lapTotalTime
          );
          activityDurationMS += parseFloat(`${lapTotalTime}e+3`);
        }

        if (lapNodes.length > 0) {
          // Set the start and end time summary data for the activity if
          // possible.
          const startMoment = moment(activityStartTimeMS);

          const activityStartTimeObj = startMoment.toDate();
          const activityEndTimeObj = startMoment
            .clone()
            .add(activityDurationMS, 'ms')
            .toDate();

          activity.setSummaryValue(
            GarminActivity.SUMMARY_KEYS.startTime,
            activityStartTimeObj
          );

          activity.setSummaryValue(
            GarminActivity.SUMMARY_KEYS.endTime,
            activityEndTimeObj
          );
        }

        // Add the populated activity to the list of activities. This activity
        // may not have laps (if it's a directory listing entry).
        activities.push(activity);
      }
    }

    return activities;
  }

  /**
   * WTF is a Course Directory as opposed to a normal activity?
   */
  _parseTcxCourseDirectory = (tcxDocument) => {
    const activities = [];

    // Grab the activity/course nodes, depending on document
    const activityNodes = tcxDocument.getElementsByTagName(SCHEMA_TAGS.course);

    // Loop through all activities in the document
    // Can there be more than one activity per document?
    for (let i = 0; i < activityNodes.length; i++) {
      // create new activity object
      const activity = this._parseTcxActivity(
        activityNodes[i],
        SCHEMA_TAGS.course
      );

      // Add the populated activity to the list of activities. This activity
      // will not have laps.
      activities.push(activity);
    }

    return activities;
  }

  /**
   *
   */
  _parseTcxActivities = (tcxDocument) => {
    const activities = [];

    // Grab the activity/course nodes, depending on document
    const activityNodes =
      tcxDocument.getElementsByTagName(SCHEMA_TAGS.activity);

    // Loop through all activities in the document
    for (let i = 0; i < activityNodes.length; i++) {
      if (activityNodes[i].parentNode.tagName === SCHEMA_TAGS.nextSport) {
        continue; /* eslint-disable-line no-continue */
      }

      // create new activity object
      const activity = this._parseTcxActivity(
        activityNodes[i],
        SCHEMA_TAGS.activity
      );

      // create a history series for all the trackpoints in this activity
      const historySeries = new GarminSeries(GarminSeries.TYPES.history);

      // grab all the lap nodes in the dom
      const lapNodes = activityNodes[i].getElementsByTagName(SCHEMA_TAGS.lap);

      // Get start time from the first lap and set duration to 0
      const activityStartTimeMS =
        lapNodes[0] && lapNodes[0].getAttribute(SCHEMA_TAGS.lapStartTime);
      let activityDurationMS = 0; // in ms
      let totalDistance = 0;
      let calories = 0;
      let maxSpeed = 0;
      let avgHeartRate = 0;
      let maxHeartRate = 0;
      // var intensity;
      let elevationGain = 0;

      // loop through all laps in this activity
      for (let j = 0; j < lapNodes.length; j++) {
        const lap = this._parseTcxLap(lapNodes[j], j);

        // Update the activity info
        activityDurationMS += parseFloat(`${lap[SCHEMA_TAGS.lapTotalTime]}e+3`);
        totalDistance += parseFloat(lap[SCHEMA_TAGS.lapDistance]);
        calories += parseInt(lap[SCHEMA_TAGS.lapCalories], 10);
        maxSpeed = lap[SCHEMA_TAGS.lapMaxSpeed] > maxSpeed ?
          lap[SCHEMA_TAGS.lapMaxSpeed] : maxSpeed;
        avgHeartRate += parseInt(lap[SCHEMA_TAGS.lapAverageHeartRate], 10);
        maxHeartRate = lap[SCHEMA_TAGS.lapMaxHeartRate] > maxHeartRate ?
          lap[SCHEMA_TAGS.lapMaxHeartRate] : maxHeartRate;

        /* not implemented until sections are in place
        // create lap section
        // set start time
        // set total time
        // set max speed
        // set intensity
        // set trigger method
        */

        let prevTrackPoint;
        let lapElevationGain = 0;
        let lapElevationLoss = 0;

        // Loop through all the tracks in this lap
        const trackPointNodes = this._getTrackPointNodes(lapNodes[j]);
        for (let ll = 0; ll < trackPointNodes.length; ll++) {
          const trackPoint = new GarminSample();
          trackPoint.setLazyLoading(
            true,
            this,
            trackPointNodes[ll]
          );

          if (ll !== 0) {
            const elevChange =
              trackPoint.getElevation() - prevTrackPoint.getElevation();
            if (elevChange > 0) {
              lapElevationGain += elevChange;
            } else {
              lapElevationLoss += elevChange;
            }
          }
          prevTrackPoint = trackPoint;

          // Add the trackpoint the historySeries for plotting on a map
          historySeries.addSample(trackPoint);
        }

        // Add net elevation change to lap data
        lap[SCHEMA_TAGS.lapElevationChange] =
          lapElevationGain + lapElevationLoss;

        // Increment activity elevation gain
        elevationGain += lapElevationGain;

        // Add the lap to the activity
        activity.addLap(lap);
      }

      if (lapNodes.length) {
        // set the start and end time summary data for the activity if possible
        const startMoment = moment(activityStartTimeMS);

        const activityStartTimeObj = startMoment.toDate();
        const activityEndTimeObj = startMoment
          .clone()
          .add(activityDurationMS, 'ms')
          .toDate();

        avgHeartRate /= lapNodes.length;

        activity.setSummaryValue(SUMMARY_KEYS.startTime, activityStartTimeObj);
        activity.setSummaryValue(SUMMARY_KEYS.endTime, activityEndTimeObj);
        activity.setSummaryValue(SUMMARY_KEYS.totalDistance, totalDistance);
        activity.setSummaryValue(SUMMARY_KEYS.calories, calories);
        activity.setSummaryValue(SUMMARY_KEYS.maxSpeed, maxSpeed);
        activity.setSummaryValue(SUMMARY_KEYS.avgHeartRate, avgHeartRate);
        activity.setSummaryValue(SUMMARY_KEYS.maxHeartRate, maxHeartRate);
        activity.setSummaryValue(SUMMARY_KEYS.elevationGain, elevationGain);
      }

      if (historySeries.getSamplesLength() > 0) {
        // add the populated series to the activity
        activity.addSeries(historySeries);
      }

      // Add the populated activity to the list of activities. This activity
      // may not have laps (if it's a directory listing entry).
      activities.push(activity);
    }

    return activities;
  }

  _parseTcxCourses = (tcxDocument) => {
    const activities = [];

    // Grab the course nodes, depending on document
    const activityNodes = tcxDocument.getElementsByTagName(SCHEMA_TAGS.course);

    // loop through all activities in the document
    for (let i = 0; i < activityNodes.length; i++) {
      // create new activity object
      const activity = this._parseTcxActivity(
        activityNodes[i],
        SCHEMA_TAGS.course
      );

      // create a history series for all the trackpoints in this activity
      const historySeries = new GarminSeries(GarminSeries.TYPES.course);

      // grab all the lap nodes in the dom
      // var lapNodes = activityNodes[i].getElementsByTagName(SCHEMA_TAGS.lap);

      // grab start time from the first lap and set duration to 0
      // let activityDurationMS;

      // if (lapNodes.length > 0) {
      //   activityDurationMS = 0; // in ms
      // }

      // loop through all laps in this activity
      // for (let jj = 0; jj < lapNodes.length; jj++) {
      //   update the duration of this activity
      //   var lapTotalTime = this._tagValue(
      //     lapNodes[jj],
      //     SCHEMA_TAGS.lapTotalTime
      //   );
      //   activityDurationMS += parseFloat(lapTotalTime + 'e+3');

      //   /* not implemented until sections are in place
      //   // create lap section
      //   // set start time
      //   // set total time
      //   // set distance
      //   // set max speed
      //   // set calories
      //   // set intensity
      //   // set trigger method
      //   */
      // }

      // loop through all the tracks in this lap
      const trackNodes = activityNodes[i].getElementsByTagName(SCHEMA_TAGS.track);
      for (let k = 0; k < trackNodes.length; k++) {
        /* not implemented until sections are in place
        // create track section
        */

        // loop through all the trackpoints in this track
        const trackPointNodes =
          trackNodes[k].getElementsByTagName(SCHEMA_TAGS.trackPoint);
        for (let l = 0; l < trackPointNodes.length; l++) {
          // historySeries.addSample(this._parseTcxTrackPoint(trackPointNodes[l]));
          const trackPoint = new GarminSample();
          trackPoint.setLazyLoading(
            true,
            this,
            trackPointNodes[l]
          );
          historySeries.addSample(trackPoint);
          // historySeries.addSample(new GarminSample());
        }
      }

      if (historySeries.getSamplesLength() > 0) {
        // add the populated series to the activity
        activity.addSeries(historySeries);
      }

      // Add the populated activity to the list of activities. This activity may
      // not have laps (if it's a directory listing entry).
      activities.push(activity);
    }

    return activities;
  }

  _parseTcxActivity = (activityNode, activityType) => {
    // create new activity object
    const activity = new GarminActivity();

    // set lazy loaded
    activity.setAttribute(ATTRIBUTE_KEYS.isLazyLoaded, true);

    // set factory
    activity.setAttribute(ATTRIBUTE_KEYS.factory, this);

    // set dom
    activity.setAttribute(ATTRIBUTE_KEYS.dom, activityNode);

    // set id
    const tagName = activityType === SCHEMA_TAGS.activity ?
      SCHEMA_TAGS.activityId : SCHEMA_TAGS.courseName;

    const id = this._tagValue(activityNode, tagName);

    activity.setAttribute(ATTRIBUTE_KEYS.activityName, id);

    // set sport
    const sport = activityNode.getAttribute(SCHEMA_TAGS.activitySport);
    activity.setAttribute(ATTRIBUTE_KEYS.activitySport, sport);

    // set creator information, optional in schema
    const creator = activityNode.getElementsByTagName(SCHEMA_TAGS.creator);
    if (creator != null && creator.length > 0) {
      // set creator name
      const creatorName = this._tagValue(creator[0], SCHEMA_TAGS.creatorName);
      activity.setAttribute(ATTRIBUTE_KEYS.creatorName, creatorName);

      // set creator unit id
      const unitId = this._tagValue(creator[0], SCHEMA_TAGS.creatorUnitID);
      activity.setAttribute(ATTRIBUTE_KEYS.creatorUnitId, unitId);

      // set creator product id
      const prodId = this._tagValue(creator[0], SCHEMA_TAGS.creatorProductID);
      activity.setAttribute(ATTRIBUTE_KEYS.creatorProdId, prodId);

      // set creator version
      const version = this._parseTcxVersion(creator[0]);
      if (version != null) {
        activity.setAttribute(ATTRIBUTE_KEYS.creatorVersion, version);
      }
    }

    return activity;
  }

  /**
   * Returns an object with all the values for the lap.
   */
  _parseTcxLap = (/* element */ lapNode, /* number */ index) /* object */ => {
    const tags = [
      SCHEMA_TAGS.lapTotalTime,
      SCHEMA_TAGS.lapDistance,
      SCHEMA_TAGS.lapCalories,
      SCHEMA_TAGS.lapMaxSpeed,
      SCHEMA_TAGS.lapAverageHeartRate,
      SCHEMA_TAGS.lapMaxHeartRate,
    ];
    const lapValues = {};
    lapValues[SCHEMA_TAGS.lap] = index + 1;

    tags.forEach((tag) => {
      lapValues[tag] = this._tagValue(lapNode, tag);
    });

    return lapValues;
  }

  _getTrackPointNodes = (/* element */ lapNode) /* HTMLCollection */ => {
    // TODO: Confirm that there is only ever one track per lap
    const trackNode = lapNode.getElementsByTagName(SCHEMA_TAGS.track)[0];
    return trackNode.getElementsByTagName(SCHEMA_TAGS.trackPoint);
  }

  _parseTcxTrackPoint = (trackPointNode, trackPointSample) => {
    // create a sample for this trackpoint if needed
    if (trackPointSample == null) {
      trackPointSample = new GarminSample();
    }
    /*
    var trackPointValueNodes = trackPointNode.childNodes;
    for (var i = 1; i < trackPointValueNodes.length; i += 2) {
      if (trackPointValueNodes[i].nodeType == 1 && trackPointValueNodes[i].hasChildNodes()) {
        var nodeValue = trackPointValueNodes[i].childNodes[0].nodeValue;
        if (nodeValue != null) {
          switch(trackPointValueNodes[i].nodeName) {
            case SCHEMA_TAGS.trackPointTime:
              trackPointSample.setMeasurement(
                MEASUREMENT_KEYS.time,
                (new DateTimeFormat()).parseXsdDateTime(nodeValue)
              );
              break;
            case SCHEMA_TAGS.position:
              //var latitude = this._tagValue(trackPointValueNodes[i], SCHEMA_TAGS.positionLatitude);
              //var longitude = this._tagValue(trackPointValueNodes[i], SCHEMA_TAGS.positionLongitude);
              var latitude = trackPointValueNodes[i].childNodes[1].childNodes[0].nodeValue;
              var longitude = trackPointValueNodes[i].childNodes[3].childNodes[0].nodeValue;
              trackPointSample.setMeasurement(MEASUREMENT_KEYS.latitude, latitude);
              trackPointSample.setMeasurement(MEASUREMENT_KEYS.longitude, longitude);
              break;
            case SCHEMA_TAGS.trackPointElevation:
              trackPointSample.setMeasurement(MEASUREMENT_KEYS.elevation, nodeValue);
              break;
            case SCHEMA_TAGS.trackPointDistance:
              trackPointSample.setMeasurement(MEASUREMENT_KEYS.distance, nodeValue);
              break;
            case SCHEMA_TAGS.trackPointHeartRate:
              //var heartRate = this._tagValue(trackPointValueNodes[i], SCHEMA_TAGS.trackPointHeartRateValue);
              var heartRate = trackPointValueNodes[i].childNodes[1].childNodes[0].nodeValue;
              trackPointSample.setMeasurement(MEASUREMENT_KEYS.heartRate, heartRate);
              break;
            case SCHEMA_TAGS.trackPointCadence:
              trackPointSample.setMeasurement(MEASUREMENT_KEYS.cadence, nodeValue);
              break;
            case SCHEMA_TAGS.trackPointSensorState:
              trackPointSample.setMeasurement(MEASUREMENT_KEYS.sensorState, nodeValue);
              break;
            default:
          }
        }
      }
    }
    */

    // set time
    const time = this._tagValue(trackPointNode, SCHEMA_TAGS.trackPointTime);
    trackPointSample.setMeasurement(
      MEASUREMENT_KEYS.time,
      moment(time).toDate()
    );

    // Set latitude and longitude, optional in schema (signal loss, create
    // signal section);
    const position = trackPointNode.getElementsByTagName(SCHEMA_TAGS.position);
    if (position.length > 0) {
      const latitude = this._tagValue(position[0], SCHEMA_TAGS.positionLatitude);
      const longitude = this._tagValue(position[0], SCHEMA_TAGS.positionLongitude);
      trackPointSample.setMeasurement(MEASUREMENT_KEYS.latitude, latitude);
      trackPointSample.setMeasurement(MEASUREMENT_KEYS.longitude, longitude);
    }

    // set elevation, optional in schema
    const elevation = this._tagValue(trackPointNode, SCHEMA_TAGS.trackPointElevation);
    if (elevation != null) {
      trackPointSample.setMeasurement(MEASUREMENT_KEYS.elevation, elevation);
    }

    // set distance, optional in schema
    const distance = this._tagValue(trackPointNode, SCHEMA_TAGS.trackPointDistance);
    if (distance != null) {
      trackPointSample.setMeasurement(MEASUREMENT_KEYS.distance, distance);
    }

    // set heart rate, optional in schema
    const heartRateNode = trackPointNode.getElementsByTagName(SCHEMA_TAGS.trackPointHeartRate);
    if (heartRateNode.length > 0) {
      const heartRate = this._tagValue(heartRateNode[0], SCHEMA_TAGS.trackPointHeartRateValue);
      trackPointSample.setMeasurement(MEASUREMENT_KEYS.heartRate, heartRate);
    }

    // set cadence, optional in schema
    const cadence = this._tagValue(trackPointNode, SCHEMA_TAGS.trackPointCadence);
    if (cadence != null) {
      trackPointSample.setMeasurement(MEASUREMENT_KEYS.cadence, cadence);
    }

    // set sensor state, optional in schema
    const sensorState = this._tagValue(trackPointNode, SCHEMA_TAGS.trackPointSensorState);
    if (sensorState != null) {
      trackPointSample.setMeasurement(MEASUREMENT_KEYS.sensorState, sensorState);
    }

    return trackPointSample;
  }

  _parseTcxVersion = (parentNode) => {
    // find the version node
    const versionNodes = parentNode.getElementsByTagName(SCHEMA_TAGS.version);

    // if there is a version node
    if (versionNodes.length > 0) {
      // get version major and minor
      const vMajor = this._tagValue(versionNodes[0], SCHEMA_TAGS.versionMajor);
      const vMinor = this._tagValue(versionNodes[0], SCHEMA_TAGS.versionMinor);

      // get buid major and minor, optional in schema
      const bMajor = this._tagValue(versionNodes[0], SCHEMA_TAGS.versionBuildMajor);
      const bMinor = this._tagValue(versionNodes[0], SCHEMA_TAGS.versionBuildMinor);

      // return version
      return bMajor != null && bMinor != null ?
        {
          buildMajor: bMajor,
          buildMinor: bMinor,
          versionMajor: vMajor,
          versionMinor: vMinor,
        } :
        {
          versionMajor: vMajor,
          versionMinor: vMinor,
        };
    }

    return null;
  }

  _tagValue = (parentNode, tagName) => {
    const subNode = parentNode.getElementsByTagName(tagName);

    // Max and avg heart rates have subnodes named 'Value' with the actual
    // value we want.
    if (subNode[0] && subNode[0].children.length) {
      return this._tagValue(subNode[0], 'Value');
    }

    return subNode.length > 0 ? subNode[0].childNodes[0].nodeValue : null;
  }
}

TcxActivityFactory.DETAIL = DETAIL;
TcxActivityFactory.SCHEMA_TAGS = SCHEMA_TAGS;

export default TcxActivityFactory;
