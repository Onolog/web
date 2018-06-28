var GarminActivity = require('./GarminActivity');
var GarminSample = require('./GarminSample');
var GarminSeries = require('./GarminSeries');
var GarminSeries = require('./GarminSeries');
var DateTimeFormat = require('../util/Util-DateTimeFormat');
var XmlConverter = require('../util/Util-XmlConverter');

var ATTRIBUTE_KEYS = GarminActivity.ATTRIBUTE_KEYS;
var MEASUREMENT_KEYS = GarminSample.MEASUREMENT_KEYS;
var SCHEMA_TAGS = {
	activities:					 "Activities",
	activity:					   "Activity",
	activityId:					 "Id",
	activitySport:			 "Sport",
	author:						   "Author",
	course:						   "Course",
	courses:					   "Courses",
	courseName:					 "Name",
	creator:					   "Creator",
	creatorName:				 "Name",
	creatorUnitID:			 "UnitId",
	creatorProductID:		 "ProductID",
	elevationGain:       "ElevationGain",
	lap:						     "Lap",
	lapAverageHeartRate: "AverageHeartRateBpm",
	lapCadence:					 "Cadence",
	lapCalories:				 "Calories",
	lapDistance:				 "DistanceMeters",
	lapElevationChange:  "ElevationChange",
	lapIntensity:				 "Intensity",
	lapMaxHeartRate:		 "MaximumHeartRateBpm",
	lapMaxSpeed:				 "MaximumSpeed",
	lapNotes:					   "Notes",
	lapStartTime:				 "StartTime",
	lapTotalTime:				 "TotalTimeSeconds",
	lapTriggerMethod:		 "TriggerMethod",
	multiSportSession:	 "MultiSportSession",
	nextSport:					 "NextSport",
	position:				  	 "Position",
	positionLatitude:		 "LatitudeDegrees",
	positionLongitude:	 "LongitudeDegrees",
	track:						   "Track",
	trackPoint:					 "Trackpoint",
	trackPointCadence:	 "Cadence",
	trackPointDistance:	 "DistanceMeters",
	trackPointElevation: "AltitudeMeters",	
	trackPointHeartRate: "HeartRateBpm",
	trackPointHeartRateValue:	"Value",
	trackPointSensorState: "SensorState",
	trackPointTime:				"Time",
	version:					    "Version",
	versionBuildMajor:		"BuildMajor",
	versionBuildMinor:		"BuildMinor",	
	versionMajor:				  "VersionMajor",
	versionMinor:				  "VersionMinor"
};
var SUMMARY_KEYS = GarminActivity.SUMMARY_KEYS;

/**
 * TcxActivityFactory
 *
 * Parses Garmin TCX files and produces a Garmin Activity object.
 */
var TcxActivityFactory = {
	
	parseString: function(tcxString) {
		var tcxDocument = XmlConverter.toDocument(tcxString);
		return this.parseDocument(tcxDocument);
	},

	/* Creates and returns an array of activities from the document. */
	parseDocument: function(tcxDocument) {
		if (
		  !tcxDocument.getElementsByTagName(SCHEMA_TAGS.activities).length &&
			!tcxDocument.getElementsByTagName(SCHEMA_TAGS.courses).length
		) {
      // Not TCX parseable
			throw new Error('Error: Unable to parse TCX document.');
		}

		var activities = tcxDocument.getElementsByTagName(SCHEMA_TAGS.activity);
		var tracks = tcxDocument.getElementsByTagName(SCHEMA_TAGS.track);
		var courses = tcxDocument.getElementsByTagName(SCHEMA_TAGS.course);
		var laps = tcxDocument.getElementsByTagName(SCHEMA_TAGS.lap);
		
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
	},
	
	produceString: function(activities) {
		var tcxString = '';

		// header tags
		tcxString += '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>';
		tcxString += '\n<TrainingCenterDatabase xmlns="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.garmin.com/xmlschemas/TrainingCenterDatabase/v2 http://www.garmin.com/xmlschemas/TrainingCenterDatabasev2.xsd http://www.garmin.com/xmlschemas/FatCalories/v1 http://www.garmin.com/xmlschemas/fatcalorieextensionv1.xsd">';
		tcxString += '\n  <Activities>';
		
		if (activities != null && activities.length > 0) {			
			// activity tags
			for (var i = 0; i < activities.length; i++) {
				tcxString += "\n    " + this._produceActivityString(activities[i]);
			}
			tcxString += '\n  </Activities>';
			
			// author tag
			var activityDom = activities[0].getAttribute(ATTRIBUTE_KEYS.dom);
			if (activityDom != null) {
				var authorDom = activityDom.ownerDocument.getElementsByTagName(SCHEMA_TAGS.author);
				if (authorDom.length > 0) {
					tcxString += "\n  " + XmlConverter.toString(authorDom[0]);
				}
			}
		}

		// footer tags
		tcxString += '\n</TrainingCenterDatabase>';
				
		return tcxString;
	},
	
	/**
   * Fully load the sample, assume sample was previously lazy-loaded.
	 */	
	finishLoadingSample: function(domNode, sample) {
		this._parseTcxTrackPoint(domNode, sample);
		sample.isLazyLoaded = false;
	},	
	
	_produceActivityString: function(activity) {
		var activityString = "";
		
		if (activity != null) {
			// converting the dom back into string
			// this is the lazy way, this will not work if 
			// converting between file types or activity data
			// has been modified.
			var activityDom = activity.getAttribute(ATTRIBUTE_KEYS.dom);			
			if (activityDom != null) {
				activityString = XmlConverter.toString(activityDom);
			}
		}
		
		return activityString;
	},
	
	_parseTcxHistoryDirectory: function(tcxDocument) {
		var activities = [];
		var activityNodes;

		// Grab the activity/course nodes, depending on document		
		activityNodes = tcxDocument.getElementsByTagName(SCHEMA_TAGS.activity);
		
		// loop through all activities in the document
		for (var i = 0; i < activityNodes.length; i++) {
			
			if (activityNodes[i].parentNode.tagName != SCHEMA_TAGS.nextSport ){
				// create new activity object
				var activity = this._parseTcxActivity(
				  activityNodes[i],
				  SCHEMA_TAGS.activity
				);
				
				// grab all the lap nodes in the dom			
				var lapNodes = activityNodes[i].getElementsByTagName(SCHEMA_TAGS.lap);
				
				// grab start time from the first lap and set duration to 0
				if (lapNodes.length > 0) {
					var activityStartTimeMS = lapNodes[0].getAttribute(SCHEMA_TAGS.lapStartTime);
					var activityDurationMS = 0;	// in ms
				}			
				
				// loop through all laps in this activity
				for (var j = 0; j < lapNodes.length; j++) {
					
					// Update the duration of this activity
					var lapTotalTime = this._tagValue(
            lapNodes[j],
            SCHEMA_TAGS.lapTotalTime
          );
					activityDurationMS += parseFloat(lapTotalTime + "e+3");
				}
				
				if (lapNodes.length > 0) {
					// set the start and end time summary data for the activity if possible
					var activityStartTimeObj = (new DateTimeFormat()).parseXsdDateTime(activityStartTimeMS);
					var activityEndTimeObj	=  new DateTimeFormat();
					// NOTE: switch to using setDate() once it is implemented in DateTimeFormat
					activityEndTimeObj.date = new Date(activityStartTimeObj.getDate().getTime() + activityDurationMS);
					activity.setSummaryValue(GarminActivity.SUMMARY_KEYS.startTime, activityStartTimeObj);
					activity.setSummaryValue(GarminActivity.SUMMARY_KEYS.endTime, activityEndTimeObj);
				}
				
				// Add the populated activity to the list of activities.  This activity may not have laps (if it's a directory listing entry).
				activities.push(activity);
			}
		}

		return activities;
	},

  /**
   * WTF is a Course Directory as opposed to a normal activity?
   */
	_parseTcxCourseDirectory: function(tcxDocument) {
		var activities = [];
		var activityNodes;

		// Grab the activity/course nodes, depending on document		
		activityNodes = tcxDocument.getElementsByTagName(SCHEMA_TAGS.course);
		
		// Loop through all activities in the document
		// Can there be more than one activity per document?
		for (var i = 0; i < activityNodes.length; i++) {
			// create new activity object
			var activity = this._parseTcxActivity(
        activityNodes[i],
        SCHEMA_TAGS.course
      );
			
			// Add the populated activity to the list of activities.  This activity will not have laps.
			activities.push(activity);
		}
		
		return activities;
	},

  /**
   * 
   */
	_parseTcxActivities: function(tcxDocument) {
		var activities = [];
		var activityNodes;

		// Grab the activity/course nodes, depending on document
		activityNodes = tcxDocument.getElementsByTagName(SCHEMA_TAGS.activity);
		
		// Loop through all activities in the document
		for (var i=0; i < activityNodes.length; i++) {

			if (activityNodes[i].parentNode.tagName === SCHEMA_TAGS.nextSport ) {
		    continue;
		  }

			// create new activity object
			var activity = this._parseTcxActivity(
        activityNodes[i],
        SCHEMA_TAGS.activity
      );
			
			// create a history series for all the trackpoints in this activity
			var historySeries = new GarminSeries(GarminSeries.TYPES.history);
			
			// grab all the lap nodes in the dom			
			var lapNodes = activityNodes[i].getElementsByTagName(SCHEMA_TAGS.lap);

      // Get start time from the first lap and set duration to 0
			var activityStartTimeMS =
			  lapNodes[0] && lapNodes[0].getAttribute(SCHEMA_TAGS.lapStartTime);
			var activityDurationMS = 0;	// in ms
			var totalDistance = 0;
			var calories = 0;
			var maxSpeed = 0;
			var avgHeartRate = 0;
			var maxHeartRate = 0;
			var intensity;
			var elevationGain = 0;

			// loop through all laps in this activity
			for (var j=0; j < lapNodes.length; j++) {

        var lap = this._parseTcxLap(lapNodes[j], j);

				// Update the activity info
				activityDurationMS += parseFloat(lap[SCHEMA_TAGS.lapTotalTime] + "e+3");
				totalDistance += parseFloat(lap[SCHEMA_TAGS.lapDistance]);
				calories += parseInt(lap[SCHEMA_TAGS.lapCalories]);
        maxSpeed = lap[SCHEMA_TAGS.lapMaxSpeed] > maxSpeed ?
          lap[SCHEMA_TAGS.lapMaxSpeed] : maxSpeed;
				avgHeartRate += parseInt(lap[SCHEMA_TAGS.lapAverageHeartRate]);
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

        var prevTrackPoint;
        var lapElevationGain = 0;
        var lapElevationLoss = 0;

  			// Loop through all the tracks in this lap
  			var trackPointNodes = this._getTrackPointNodes(lapNodes[j]);
  			for (var ll=0; ll < trackPointNodes.length; ll++) {
  				var trackPoint = new GarminSample();
  				trackPoint.setLazyLoading(
            true,
            this,
            trackPointNodes[ll]
          );

          if (ll !== 0) {
            var elevChange =
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
				var activityStartTimeObj =
				  (new DateTimeFormat()).parseXsdDateTime(activityStartTimeMS);
				var activityEndTimeObj = new DateTimeFormat();
				// NOTE: switch to using setDate() once it is implemented in GarminDateTimeFormat
				activityEndTimeObj.date =
				  new Date(activityStartTimeObj.getDate().getTime() + activityDurationMS);
				avgHeartRate = avgHeartRate / lapNodes.length;

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
	},
	
	_parseTcxCourses: function(tcxDocument) {
		var activities = [];
		var activityNodes;

		// Grab the course nodes, depending on document		
		activityNodes = tcxDocument.getElementsByTagName(SCHEMA_TAGS.course);
		
		// loop through all activities in the document
		for (var i = 0; i < activityNodes.length; i++) {
			
			// create new activity object
			var activity = this._parseTcxActivity(
        activityNodes[i],
        SCHEMA_TAGS.course
      );
			
			// create a history series for all the trackpoints in this activity
			var historySeries = new GarminSeries(GarminSeries.TYPES.course);
			
			// grab all the lap nodes in the dom			
			var lapNodes = activityNodes[i].getElementsByTagName(SCHEMA_TAGS.lap);
			
			// grab start time from the first lap and set duration to 0
			if (lapNodes.length > 0) {
				var activityDurationMS = 0;	// in ms
			}		
			
			// loop through all laps in this activity
			for (var j = 0; j < lapNodes.length; j++) {
				
				// update the duration of this activity
				var lapTotalTime = this._tagValue(
          lapNodes[j],
          SCHEMA_TAGS.lapTotalTime
        );
				activityDurationMS += parseFloat(lapTotalTime + "e+3");
				
				/* not implemented until sections are in place
				// create lap section
				// set start time				
				// set total time				
				// set distance				
				// set max speed				
				// set calories				
				// set intensity				
				// set trigger method
				*/
			}
			
			// loop through all the tracks in this lap
			var trackNodes = activityNodes[i].getElementsByTagName(SCHEMA_TAGS.track);			
			for (var k = 0; k < trackNodes.length; k++) {
				
				/* not implemented until sections are in place
				// create track section
				*/					
				
				// loop through all the trackpoints in this track
				var trackPointNodes = trackNodes[k].getElementsByTagName(SCHEMA_TAGS.trackPoint);
				for (var l = 0; l < trackPointNodes.length; l++) {
					//historySeries.addSample(this._parseTcxTrackPoint(trackPointNodes[l]));
					var trackPoint = new GarminSample();
					trackPoint.setLazyLoading(
            true,
            this,
            trackPointNodes[l]
          );
					historySeries.addSample(trackPoint);
					//historySeries.addSample(new GarminSample());
				}					
			}
			
			if (historySeries.getSamplesLength() > 0) {				
				// add the populated series to the activity
				activity.addSeries(historySeries);
			}
			
			// Add the populated activity to the list of activities.  This activity may not have laps (if it's a directory listing entry).
			activities.push(activity);
		}
		
		return activities;
	},
	
	_parseTcxActivity: function(activityNode, activityType) {
		// create new activity object
		var activity = new GarminActivity();
		
		// set lazy loaded
		activity.setAttribute(ATTRIBUTE_KEYS.isLazyLoaded, true);
		
		// set factory
		activity.setAttribute(ATTRIBUTE_KEYS.factory, this);
		
		// set dom
		activity.setAttribute(ATTRIBUTE_KEYS.dom, activityNode);
		
		// set id
		var tagName = activityType == SCHEMA_TAGS.activity ?
			SCHEMA_TAGS.activityId : SCHEMA_TAGS.courseName;

    var id = this._tagValue(activityNode, tagName);

		activity.setAttribute(ATTRIBUTE_KEYS.activityName, id)		
		
		// set sport
		var sport = activityNode.getAttribute(SCHEMA_TAGS.activitySport);
		activity.setAttribute(ATTRIBUTE_KEYS.activitySport, sport);	
		
		// set creator information, optional in schema
		var creator = activityNode.getElementsByTagName(SCHEMA_TAGS.creator);
		if (creator != null && creator.length > 0) {
			// set creator name
			var creatorName = this._tagValue(creator[0], SCHEMA_TAGS.creatorName);
			activity.setAttribute(ATTRIBUTE_KEYS.creatorName, creatorName);
			
			// set creator unit id
			var unitId = this._tagValue(creator[0], SCHEMA_TAGS.creatorUnitID);
			activity.setAttribute(ATTRIBUTE_KEYS.creatorUnitId, unitId);
							
			// set creator product id
			var prodId = this._tagValue(creator[0], SCHEMA_TAGS.creatorProductID);
			activity.setAttribute(ATTRIBUTE_KEYS.creatorProdId, prodId);
							
			// set creator version
			var version = this._parseTcxVersion(creator[0]);
			if (version != null) {
				activity.setAttribute(ATTRIBUTE_KEYS.creatorVersion, version);
			}
		}
		
		return activity;
	},

  /**
   * Returns an object with all the values for the lap.
   */
	_parseTcxLap: function(/*element*/ lapNode, /*number*/ index) /*object*/ {
    var tags = [
      SCHEMA_TAGS.lapTotalTime,
      SCHEMA_TAGS.lapDistance,
      SCHEMA_TAGS.lapCalories,
      SCHEMA_TAGS.lapMaxSpeed,
      SCHEMA_TAGS.lapAverageHeartRate,
      SCHEMA_TAGS.lapMaxHeartRate
    ];
    var lapValues = {};
    lapValues[SCHEMA_TAGS.lap] = index + 1;

    tags.forEach(function(tag) {
      lapValues[tag] = this._tagValue(lapNode, tag);
    }.bind(this));

    return lapValues;
	},

  _getTrackPointNodes: function(/*element*/ lapNode) /*HTMLCollection*/ {
    // TODO: Confirm that there is only ever one track per lap
    var trackNode = lapNode.getElementsByTagName(SCHEMA_TAGS.track)[0];
    return trackNode.getElementsByTagName(SCHEMA_TAGS.trackPoint);
  },

	_parseTcxTrackPoint: function(trackPointNode, trackPointSample) {
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
		var time = this._tagValue(trackPointNode, SCHEMA_TAGS.trackPointTime);
		trackPointSample.setMeasurement(
      MEASUREMENT_KEYS.time,
      (new DateTimeFormat()).parseXsdDateTime(time)
    );

		// set latitude and longitude, optional in schema (signal loss, create signal section);					
		var position = trackPointNode.getElementsByTagName(SCHEMA_TAGS.position);
		if (position.length > 0) {
			var latitude = this._tagValue(position[0], SCHEMA_TAGS.positionLatitude);		
			var longitude = this._tagValue(position[0], SCHEMA_TAGS.positionLongitude);
			trackPointSample.setMeasurement(MEASUREMENT_KEYS.latitude, latitude);
			trackPointSample.setMeasurement(MEASUREMENT_KEYS.longitude, longitude);						
		}
					
		// set elevation, optional in schema
		var elevation = this._tagValue(trackPointNode, SCHEMA_TAGS.trackPointElevation);
		if (elevation != null) {
			trackPointSample.setMeasurement(MEASUREMENT_KEYS.elevation, elevation);
		}
		
		// set distance, optional in schema
		var distance = this._tagValue(trackPointNode, SCHEMA_TAGS.trackPointDistance);
		if (distance != null) {
			trackPointSample.setMeasurement(MEASUREMENT_KEYS.distance, distance);
		}

		// set heart rate, optional in schema
		var heartRateNode = trackPointNode.getElementsByTagName(SCHEMA_TAGS.trackPointHeartRate);
		if (heartRateNode.length > 0) {
			var heartRate = this._tagValue(heartRateNode[0], SCHEMA_TAGS.trackPointHeartRateValue);
			trackPointSample.setMeasurement(MEASUREMENT_KEYS.heartRate, heartRate);
		}

		// set cadence, optional in schema
		var cadence = this._tagValue(trackPointNode, SCHEMA_TAGS.trackPointCadence);
		if (cadence != null) {
			trackPointSample.setMeasurement(MEASUREMENT_KEYS.cadence, cadence);
		}

		// set sensor state, optional in schema
		var sensorState = this._tagValue(trackPointNode, SCHEMA_TAGS.trackPointSensorState);
		if (sensorState != null) {
			trackPointSample.setMeasurement(MEASUREMENT_KEYS.sensorState, sensorState);
		}

		return trackPointSample;
	},

	_parseTcxVersion: function(parentNode) {
		// find the version node
		var versionNodes = parentNode.getElementsByTagName(SCHEMA_TAGS.version);

		// if there is a version node
		if (versionNodes.length > 0) {					
			// get version major and minor
			var vMajor = this._tagValue(versionNodes[0], SCHEMA_TAGS.versionMajor);
			var vMinor = this._tagValue(versionNodes[0], SCHEMA_TAGS.versionMinor);

			// get buid major and minor, optional in schema
			var bMajor = this._tagValue(versionNodes[0], SCHEMA_TAGS.versionBuildMajor);
			var bMinor = this._tagValue(versionNodes[0], SCHEMA_TAGS.versionBuildMinor);

			// return version
			if ((bMajor != null) && (bMinor != null)) {
				return { versionMajor: vMajor, versionMinor: vMinor, buildMajor: bMajor, buildMinor: bMinor };
			} else {
				return { versionMajor: vMajor, versionMinor: vMinor };
			}
		} else {
			return null;
		}
	},	
	
	_tagValue: function(parentNode, tagName) {
		var subNode = parentNode.getElementsByTagName(tagName);

    // Max and avg heart rates have subnodes named 'Value' with the actual
    // value we want.
		if (subNode[0] && subNode[0].children.length) {
		  return this._tagValue(subNode[0], 'Value');
		}

		return subNode.length > 0 ? subNode[0].childNodes[0].nodeValue : null;
	},	

  toString: function() {
    return "[TcxActivityFactory]";
  }
};

TcxActivityFactory.DETAIL = {
	creator: 'Garmin Communicator Plugin API - http://www.garmin.com/'
};
TcxActivityFactory.SCHEMA_TAGS = SCHEMA_TAGS;

module.exports = TcxActivityFactory;
