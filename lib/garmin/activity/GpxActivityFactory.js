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
 * @fileoverview GpxActivityFactory - A factory for producing gpx activity and data.
 * @version 1.9
 */

/**
 * A factory that can produce an array activity given gpx xml and produce gps xml given an
 * array of activity.
 * many other types of data.
 *
 * @class GpxActivityFactory
 * @constructor 
 */
var GarminActivity = require('lib/garmin/activity/GarminActivity');
var GarminSample = require('lib/garmin/activity/GarminSample');
var GarminSeries = require('lib/garmin/activity/GarminSeries');
var DateTimeFormat = require('lib/garmin/util/Util-DateTimeFormat');
var XmlConverter = require('lib/garmin/util/Util-XmlConverter');

var {ATTRIBUTE_KEYS, SUMMARY_KEYS} = GarminActivity;
var {MEASUREMENT_KEYS} = GarminSample;
var {TYPES} = GarminSeries;

var DETAIL = {
  creator: 'Garmin Communicator Plug-In API'
};

var GPX_TYPE = {
  routes:    "routes",
  waypoints: "waypoints",
  tracks:    "tracks",
  all:       "all"
};

/**
 * Constants defining tags used by the gpx schema. This is used
 * by the factory when converting between the xml and datastructure.
 */
var SCHEMA_TAGS = {
  creator:          "creator",
  gpx:            "gpx",
  metadata:         "metadata",
  route:            "rte",
  routeName:          "name",
  routePoint:         "rtept",
  track:            "trk",
  trackName:          "name",
  trackPoint:         "trkpt",
  trackSegment:       "trkseg",
  waypoint:         "wpt",
  waypointComment:      "cmt",
  waypointDGPSAge:      "ageofdgpsdata",
  waypointDGPSID:       "dgpsid",
  waypointDescription:    "desc",
  waypointGeoIdHeight:    "geoidheight",
  waypointHDOP:       "hdop",
  waypointMagVar:       "magvar",
  waypointName:       "name",
  waypointLatitude:     "lat",
  waypointLink:       "link",
  waypointLongitude:      "lon",
  waypointElevation:      "ele",
  waypointPDOP:       "pdop",
  waypointSatellites:     "sat",
  waypointSource:       "src",
  waypointSymbol:       "sym",
  waypointTime:       "time",
  waypointType:       "type",
  waypointVDOP:       "vdop"
}

var GpxActivityFactory = {

	parseString: function(gpxString) {
		var gpxDocument = XmlConverter.toDocument(gpxString);		
		return this.parseDocument(gpxDocument);	
	},
	
	parseDocument: function(gpxDocument) {
    return this.parseDocumentByType(gpxDocument, GPX_TYPE.all);
	},
	
	parseDocumentByType: function(gpxDocument, type) {
		var activities = [];
    var routes = [];
    var tracks = [];
    var waypoints = [];

    switch(type) {
      case GPX_TYPE.routes:
        activities = this._parseGpxRoutes(gpxDocument);
        break;
      case GPX_TYPE.waypoints:
        activities = this._parseGpxWaypoints(gpxDocument);
        break;
      case GPX_TYPE.tracks:
        activities = this._parseGpxTracks(gpxDocument);
        break;
      case GPX_TYPE.all:
        routes = this._parseGpxRoutes(gpxDocument);
        tracks = this._parseGpxTracks(gpxDocument);
        waypoints = this._parseGpxWaypoints(gpxDocument);
        activities = waypoints.concat(routes).concat(tracks);
        break;    
    }
     
    return activities;
	},
	
	produceString: function(activities) {
		var gpxString = '';
		
		// default creator information incase we can't find the creator info in the dom
		var creator = DETAIL.creator;
		
		// default metadata information incase we can't find the metadata node in the dom
		var metadata = "\n  <metadata>";
		metadata += "\n    <link href=\"http://www.garmin.com\">";
		metadata += "\n      <text>Garmin International</text>";
		metadata += "\n    </link>";						
		metadata += "\n  </metadata>";
		
		// try to find creator and metadata info in the dom
		if (activities != null && activities.length > 0) {
			var activityDom = activities[0].getAttribute(ATTRIBUTE_KEYS.dom);
			var gpxNode = activityDom.ownerDocument.getElementsByTagName(SCHEMA_TAGS.gpx);
			if (gpxNode.length > 0) {
				// grab creator information from the dom if possible
				var creatorStr = gpxNode[0].getAttribute(SCHEMA_TAGS.creator);
				if (creatorStr != null && creatorStr != "") {
					creator = creatorStr;
				}
				// grab metadata info
				var metadataNode = gpxNode[0].getElementsByTagName(SCHEMA_TAGS.metadata);
				if (metadataNode.length > 0) {
					metadata = XmlConverter.toString(metadataNode[0]);
				}
			}
		}

		// header tags
		gpxString += "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\" ?>";	
		gpxString += "\n<gpx xmlns=\"http://www.topografix.com/GPX/1/1\" creator=\"" + creator + "\" version=\"1.1\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd http://www.garmin.com/xmlschemas/GpxExtensions/v3 http://www.garmin.com/xmlschemas/GpxExtensions/v3/GpxExtensionsv3.xsd\">";
	
		//metadata tag
		gpxString += "\n  " + metadata;
		
		if (activities != null) {
			// waypoint and track tags
			for(var i = 0; i < activities.length; i++) {		
				gpxString += "\n  " + this._produceActivityString(activities[i]);
			}
		}
		
		// footer tags
		gpxString += "\n</gpx>";
		
		return gpxString;
	},
	
	/** Fully load the sample, assume sample was previously lazy-loaded
	 */	
	finishLoadingSample: function(domNode, sample) {
		if (domNode.nodeName == SCHEMA_TAGS.routePoint) {
			this._parseGpxRoutePoint(domNode, sample);
			sample.isLazyLoaded = false;
		} else if (domNode.nodeName == SCHEMA_TAGS.trackPoint) {
			this._parseGpxTrackPoint(domNode, sample);
			sample.isLazyLoaded = false;
		}
	},		
	
	_produceActivityString: function(activity) {
		var activityString = "";
		if (activity != null) {
			var series = activity.getSeries();
			for (var i = 0; i < series.length; i++) {
				var currentSeries = series[i];
				if (currentSeries.getSeriesType() == TYPES.history) {
					// converting the dom back into string
					// this is the lazy way, this will not work if 
					// converting between file types or activity data
					// has been modified.
					var activityDom = activity.getAttribute(ATTRIBUTE_KEYS.dom);			
					if (activityDom != null) {
						activityString = XmlConverter.toString(activityDom);
					}
				} else if (currentSeries.getSeriesType() == TYPES.waypoint) {
					// converting the dom back into string
					// this is the lazy way, this will not work if 
					// converting between file types or activity data
					// has been modified.
					var activityDom = activity.getAttribute(ATTRIBUTE_KEYS.dom);			
					if (activityDom != null) {
						activityString = XmlConverter.toString(activityDom);
					}						
				}
			}
		}		
		return activityString;
	},
	
	_parseGpxRoutes: function(gpxDocument) {
		var routes = new Array();
    	var routeNodes = gpxDocument.getElementsByTagName(SCHEMA_TAGS.route);

		for( var i=0; i < routeNodes.length; i++ ) {
			var route = new GarminActivity();
			
			var routeName = this._tagValue(routeNodes[i], SCHEMA_TAGS.routeName);
			if (routeName == null) {
				routeName = "";
			}
			
			route.setAttribute(ATTRIBUTE_KEYS.dom, routeNodes[i]);
			route.setAttribute(ATTRIBUTE_KEYS.activityName, routeName);

			var series = new GarminSeries(TYPES.route);
			route.addSeries(series);

			var routePoints = routeNodes[i].getElementsByTagName(
        SCHEMA_TAGS.routePoint
      );
			if (routePoints.length > 0) {					
				for( var j=0; j < routePoints.length; j++ ) {
					var routePoint = new GarminSample();
					routePoint.setLazyLoading(true, this, routePoints[j]);
					series.addSample(routePoint);
				}
			}
			
			if (series.getSamplesLength() > 0) {
				routes.push(route);
			}
		}

    return routes;			
	},
	
	_parseGpxRoutePoint: function(routePointNode, routePointSample) {
		if (routePointSample == null) {
			routePointSample = new GarminSample();
		}

		routePointSample.setMeasurement(MEASUREMENT_KEYS.latitude, routePointNode.getAttribute(SCHEMA_TAGS.waypointLatitude));
		routePointSample.setMeasurement(MEASUREMENT_KEYS.longitude, routePointNode.getAttribute(SCHEMA_TAGS.waypointLongitude));
		
		var elevation =  this._tagValue(routePointNode, SCHEMA_TAGS.waypointElevation);
		if (elevation != null) {
			routePointSample.setMeasurement(MEASUREMENT_KEYS.elevation, elevation);
		}		
		
		return routePointSample;		
	},
	
	_parseGpxTracks: function(gpxDocument) {
		var tracks = new Array();
		
    	var trackNodes = gpxDocument.getElementsByTagName(SCHEMA_TAGS.track);
		for( var i=0; i < trackNodes.length; i++ ) {
			var track = new GarminActivity();
			
			var trackName = this._tagValue(trackNodes[i], SCHEMA_TAGS.trackName);
			if (trackName == null) {
				trackName = "";
			}
			
			track.setAttribute(ATTRIBUTE_KEYS.dom, trackNodes[i]);
			track.setAttribute(ATTRIBUTE_KEYS.activityName, trackName);

			var series = new GarminSeries(TYPES.history);
			track.addSeries(series);

			var trackSegments = trackNodes[i].getElementsByTagName(SCHEMA_TAGS.trackSegment);	
			for( var j=0; j < trackSegments.length; j++ ) {
				
				// grab all the trackpoints
				var trackPoints = trackSegments[j].getElementsByTagName(SCHEMA_TAGS.trackPoint);											
				if (trackPoints.length > 0) {
					
					// set the start and end time summary values		
					var startTime = this._tagValue(trackPoints[0], SCHEMA_TAGS.waypointTime);
					var endTime = this._tagValue(
            trackPoints[trackPoints.length - 1],
            SCHEMA_TAGS.waypointTime
          );
					if (startTime != null && endTime != null) {
						track.setSummaryValue(
              SUMMARY_KEYS.startTime,
              (new DateTimeFormat()).parseXsdDateTime(startTime)
            );
						track.setSummaryValue(
              SUMMARY_KEYS.endTime,
              (new DateTimeFormat()).parseXsdDateTime(endTime)
            );
					} else {
						// can't find timestamps, must be a route reported as a track (GPSMap does this)
						series.setSeriesType(TYPES.route);
					}
				
					// loop through all the trackpoints in this segment				
					for( var k=0; k < trackPoints.length; k++ ) {
						var trackPoint = new GarminSample();
						trackPoint.setLazyLoading(true, this, trackPoints[k]);
						series.addSample(trackPoint);						
					}
					
					// add the track to the list of tracks
					tracks.push(track);
				}
			}
		}

    	return tracks;	
	},
	
	_parseGpxTrackPoint: function(trackPointNode, trackPointSample) {
		if (trackPointSample == null) {
			trackPointSample = new GarminSample();	
		}
		
		trackPointSample.setMeasurement(MEASUREMENT_KEYS.latitude, trackPointNode.getAttribute(SCHEMA_TAGS.waypointLatitude));
		trackPointSample.setMeasurement(MEASUREMENT_KEYS.longitude, trackPointNode.getAttribute(SCHEMA_TAGS.waypointLongitude));
		
		var elevation =  this._tagValue(trackPointNode,SCHEMA_TAGS.waypointElevation);
		if (elevation != null) {
			trackPointSample.setMeasurement(MEASUREMENT_KEYS.elevation, elevation);
		}

		var time = this._tagValue(trackPointNode, SCHEMA_TAGS.waypointTime);
		if (time != null) {
			trackPointSample.setMeasurement(
        MEASUREMENT_KEYS.time,
        (new DateTimeFormat()).parseXsdDateTime(time)
      );
		}			
		
		return trackPointSample;
	},
	
	_parseGpxWaypoints: function(gpxDocument) {
		var waypoints = new Array();
    	var waypointNodes = gpxDocument.getElementsByTagName(SCHEMA_TAGS.waypoint);
    	
		for( var i=0; i < waypointNodes.length; i++ ) {
			waypoints.push(this._parseGpxWaypoint(waypointNodes[i]));
		}
    	
    	return waypoints;
	},
	
	_parseGpxWaypoint: function(waypointNode) {
		var waypoint = new GarminActivity();
		var waypointSeries = new GarminSeries(TYPES.waypoint);
		var waypointSample = new GarminSample();
		
		waypoint.setAttribute(ATTRIBUTE_KEYS.dom, waypointNode);			

		waypointSample.setMeasurement(
      MEASUREMENT_KEYS.latitude,
      waypointNode.getAttribute(SCHEMA_TAGS.waypointLatitude)
    );
		waypointSample.setMeasurement(
      MEASUREMENT_KEYS.longitude,
      waypointNode.getAttribute(SCHEMA_TAGS.waypointLongitude)
    );
				
		var elevation =  this._tagValue(waypointNode, SCHEMA_TAGS.waypointElevation);
		if (elevation != null) {
			waypointSample.setMeasurement(MEASUREMENT_KEYS.elevation, elevation);
		}
		
		var wptName =  this._tagValue(waypointNode,SCHEMA_TAGS.waypointName);
		if (wptName != null) {
			waypoint.setAttribute(ATTRIBUTE_KEYS.activityName, wptName);
		}
		
		waypointSeries.addSample(waypointSample);
		waypoint.addSeries(waypointSeries);		
   		return waypoint;
	},
	
	_tagValue: function(parentNode, tagName) {
		var subNode = parentNode.getElementsByTagName(tagName);
		return subNode.length > 0 ? subNode[0].childNodes[0].nodeValue : null;
	},	
	
    toString: function() {
      return "[GpxActivityFactory]";
    }	
};

GpxActivityFactory.DETAIL = DETAIL;
GpxActivityFactory.GPX_TYPE = GPX_TYPE;
GpxActivityFactory.SCHEMA_TAGS = SCHEMA_TAGS;

module.exports = GpxActivityFactory;
