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
 * @fileoverview GpxActivityFactory - A factory for producing gpx activity and
 * data.
 * @version 1.9
 */
import moment from 'moment';

import GarminActivity from './GarminActivity';
import GarminSample from './GarminSample';
import GarminSeries from './GarminSeries';
import XmlConverter from './XmlConverter';

const { ATTRIBUTE_KEYS, SUMMARY_KEYS } = GarminActivity;
const { MEASUREMENT_KEYS } = GarminSample;
const { TYPES } = GarminSeries;

const DETAIL = {
  creator: 'Garmin Communicator Plug-In API',
};

const GPX_TYPE = {
  all: 'all',
  routes: 'routes',
  tracks: 'tracks',
  waypoints: 'waypoints',
};

/**
 * Constants defining tags used by the gpx schema. This is used
 * by the factory when converting between the xml and datastructure.
 */
const SCHEMA_TAGS = {
  creator: 'creator',
  gpx: 'gpx',
  metadata: 'metadata',
  route: 'rte',
  routeName: 'name',
  routePoint: 'rtept',
  track: 'trk',
  trackName: 'name',
  trackPoint: 'trkpt',
  trackSegment: 'trkseg',
  waypoint: 'wpt',
  waypointComment: 'cmt',
  waypointDGPSAge: 'ageofdgpsdata',
  waypointDGPSID: 'dgpsid',
  waypointDescription: 'desc',
  waypointGeoIdHeight: 'geoidheight',
  waypointHDOP: 'hdop',
  waypointMagVar: 'magvar',
  waypointName: 'name',
  waypointLatitude: 'lat',
  waypointLink: 'link',
  waypointLongitude: 'lon',
  waypointElevation: 'ele',
  waypointPDOP: 'pdop',
  waypointSatellites: 'sat',
  waypointSource: 'src',
  waypointSymbol: 'sym',
  waypointTime: 'time',
  waypointType: 'type',
  waypointVDOP: 'vdop',
};

/**
 * A factory that can produce an array activity given gpx xml and produce gps
 * xml given an array of activity.
 * many other types of data.
 *
 * @class GpxActivityFactory
 * @constructor
 */
class GpxActivityFactory {
  parseString = (gpxString) => {
    const gpxDocument = XmlConverter.toDocument(gpxString);
    return this.parseDocument(gpxDocument);
  }

  parseDocument = (gpxDocument) => {
    return this.parseDocumentByType(gpxDocument, GPX_TYPE.all);
  }

  parseDocumentByType = (gpxDocument, type) => {
    let activities = [];
    let routes = [];
    let tracks = [];
    let waypoints = [];

    switch (type) {
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
      default:
        break;
    }

    return activities;
  }

  produceString = (activities) => {
    // Default creator information in case we can't find the info in the dom.
    let { creator } = DETAIL;

    // default metadata information in case we can't find the node in the dom.
    let metadata = `
      <metadata>
        <link href="http://www.garmin.com">
          <text>Garmin International</text>
        </link>;
      </metadata>
    `;

    // try to find creator and metadata info in the dom
    if (activities != null && activities.length > 0) {
      const activityDom = activities[0].getAttribute(ATTRIBUTE_KEYS.dom);
      const gpxNode =
        activityDom.ownerDocument.getElementsByTagName(SCHEMA_TAGS.gpx);
      if (gpxNode.length > 0) {
        // grab creator information from the dom if possible
        const creatorStr = gpxNode[0].getAttribute(SCHEMA_TAGS.creator);
        if (creatorStr != null && creatorStr !== '') {
          creator = creatorStr;
        }

        // Grab metadata info
        const metadataNode =
          gpxNode[0].getElementsByTagName(SCHEMA_TAGS.metadata);
        if (metadataNode.length) {
          metadata = XmlConverter.toString(metadataNode[0]);
        }
      }
    }

    const locations = [
      'http://www.topografix.com/GPX/1/1',
      'http://www.topografix.com/GPX/1/1/gpx.xsd',
      'http://www.garmin.com/xmlschemas/GpxExtensions/v3',
      'http://www.garmin.com/xmlschemas/GpxExtensions/v3/GpxExtensionsv3.xsd',
    ];

    // Header tags
    let gpxString = /* eslint-disable prefer-template */
      '<?xml version="1.0" encoding="UTF-8" standalone="no" ?>' +
      '<gpx ' +
        'xmlns="http://www.topografix.com/GPX/1/1" ' +
        `creator="${creator}" ` +
        'version="1.1" ' +
        'xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
        `xsi:schemaLocation="${locations.join(' ')}">\n` +
        metadata;

    if (activities != null) {
      // waypoint and track tags
      for (let i = 0; i < activities.length; i++) {
        gpxString += `\n  ${this._produceActivityString(activities[i])}`;
      }
    }

    // footer tags
    gpxString += '\n</gpx>';

    return gpxString;
  }

  /**
   * Fully load the sample, assume sample was previously lazy-loaded
   */
  finishLoadingSample = (domNode, sample) => {
    if (domNode.nodeName === SCHEMA_TAGS.routePoint) {
      this._parseGpxRoutePoint(domNode, sample);
      sample.isLazyLoaded = false;
    } else if (domNode.nodeName === SCHEMA_TAGS.trackPoint) {
      this._parseGpxTrackPoint(domNode, sample);
      sample.isLazyLoaded = false;
    }
  }

  _produceActivityString = (activity) => {
    if (!activity) {
      return '';
    }

    const series = activity.getSeries();

    for (let i = 0; i < series.length; i++) {
      const seriesType = series[i].getSeriesType();

      if (seriesType === TYPES.history || seriesType === TYPES.waypoint) {
        // converting the dom back into string
        // this is the lazy way, this will not work if
        // converting between file types or activity data
        // has been modified.
        const activityDom = activity.getAttribute(ATTRIBUTE_KEYS.dom);
        if (activityDom) {
          return XmlConverter.toString(activityDom);
        }
      }
    }

    return '';
  }

  _parseGpxRoutes = (gpxDocument) => {
    const routes = [];
    const routeNodes = gpxDocument.getElementsByTagName(SCHEMA_TAGS.route);

    for (let i = 0; i < routeNodes.length; i++) {
      const route = new GarminActivity();

      let routeName = this._tagValue(routeNodes[i], SCHEMA_TAGS.routeName);
      if (routeName == null) {
        routeName = '';
      }

      route.setAttribute(ATTRIBUTE_KEYS.dom, routeNodes[i]);
      route.setAttribute(ATTRIBUTE_KEYS.activityName, routeName);

      const series = new GarminSeries(TYPES.route);
      route.addSeries(series);

      const routePoints = routeNodes[i].getElementsByTagName(
        SCHEMA_TAGS.routePoint
      );
      if (routePoints.length > 0) {
        for (let j = 0; j < routePoints.length; j++) {
          const routePoint = new GarminSample();
          routePoint.setLazyLoading(true, this, routePoints[j]);
          series.addSample(routePoint);
        }
      }

      if (series.getSamplesLength() > 0) {
        routes.push(route);
      }
    }

    return routes;
  }

  _parseGpxRoutePoint = (routePointNode, routePointSample) => {
    if (routePointSample == null) {
      routePointSample = new GarminSample();
    }

    routePointSample.setMeasurement(
      MEASUREMENT_KEYS.latitude,
      routePointNode.getAttribute(SCHEMA_TAGS.waypointLatitude)
    );
    routePointSample.setMeasurement(
      MEASUREMENT_KEYS.longitude,
      routePointNode.getAttribute(SCHEMA_TAGS.waypointLongitude)
    );

    const elevation = this._tagValue(
      routePointNode,
      SCHEMA_TAGS.waypointElevation
    );

    if (elevation) {
      routePointSample.setMeasurement(MEASUREMENT_KEYS.elevation, elevation);
    }

    return routePointSample;
  }

  _parseGpxTracks = (gpxDocument) => {
    const tracks = [];

    const trackNodes = gpxDocument.getElementsByTagName(SCHEMA_TAGS.track);
    for (let i = 0; i < trackNodes.length; i++) {
      const track = new GarminActivity();

      let trackName = this._tagValue(trackNodes[i], SCHEMA_TAGS.trackName);
      if (trackName == null) {
        trackName = '';
      }

      track.setAttribute(ATTRIBUTE_KEYS.dom, trackNodes[i]);
      track.setAttribute(ATTRIBUTE_KEYS.activityName, trackName);

      const series = new GarminSeries(TYPES.history);
      track.addSeries(series);

      const trackSegments =
        trackNodes[i].getElementsByTagName(SCHEMA_TAGS.trackSegment);

      for (let j = 0; j < trackSegments.length; j++) {
        // grab all the trackpoints
        const trackPoints =
          trackSegments[j].getElementsByTagName(SCHEMA_TAGS.trackPoint);

        if (trackPoints.length > 0) {
          // set the start and end time summary values
          const startTime = this._tagValue(
            trackPoints[0],
            SCHEMA_TAGS.waypointTime
          );

          const endTime = this._tagValue(
            trackPoints[trackPoints.length - 1],
            SCHEMA_TAGS.waypointTime
          );

          if (startTime && endTime) {
            track.setSummaryValue(
              SUMMARY_KEYS.startTime,
              moment(startTime).toDate()
            );
            track.setSummaryValue(
              SUMMARY_KEYS.endTime,
              moment(endTime).toDate()
            );
          } else {
            // Can't find timestamps, must be a route reported as a track
            // (GPSMap does this)
            series.setSeriesType(TYPES.route);
          }

          // loop through all the trackpoints in this segment
          for (let k = 0; k < trackPoints.length; k++) {
            const trackPoint = new GarminSample();
            trackPoint.setLazyLoading(true, this, trackPoints[k]);
            series.addSample(trackPoint);
          }

          // add the track to the list of tracks
          tracks.push(track);
        }
      }
    }

    return tracks;
  }

  _parseGpxTrackPoint = (trackPointNode, trackPointSample) => {
    if (trackPointSample == null) {
      trackPointSample = new GarminSample();
    }

    trackPointSample.setMeasurement(
      MEASUREMENT_KEYS.latitude,
      trackPointNode.getAttribute(SCHEMA_TAGS.waypointLatitude)
    );

    trackPointSample.setMeasurement(
      MEASUREMENT_KEYS.longitude,
      trackPointNode.getAttribute(SCHEMA_TAGS.waypointLongitude)
    );

    const elevation = this._tagValue(
      trackPointNode,
      SCHEMA_TAGS.waypointElevation
    );

    if (elevation) {
      trackPointSample.setMeasurement(MEASUREMENT_KEYS.elevation, elevation);
    }

    const time = this._tagValue(trackPointNode, SCHEMA_TAGS.waypointTime);
    if (time != null) {
      trackPointSample.setMeasurement(
        MEASUREMENT_KEYS.time,
        moment(time).toDate()
      );
    }

    return trackPointSample;
  }

  _parseGpxWaypoints = (gpxDocument) => {
    const waypoints = [];
    const waypointNodes =
      gpxDocument.getElementsByTagName(SCHEMA_TAGS.waypoint);

    for (let i = 0; i < waypointNodes.length; i++) {
      waypoints.push(this._parseGpxWaypoint(waypointNodes[i]));
    }

    return waypoints;
  }

  _parseGpxWaypoint = (waypointNode) => {
    const waypoint = new GarminActivity();
    const waypointSeries = new GarminSeries(TYPES.waypoint);
    const waypointSample = new GarminSample();

    waypoint.setAttribute(ATTRIBUTE_KEYS.dom, waypointNode);

    waypointSample.setMeasurement(
      MEASUREMENT_KEYS.latitude,
      waypointNode.getAttribute(SCHEMA_TAGS.waypointLatitude)
    );
    waypointSample.setMeasurement(
      MEASUREMENT_KEYS.longitude,
      waypointNode.getAttribute(SCHEMA_TAGS.waypointLongitude)
    );

    const elevation = this._tagValue(
      waypointNode,
      SCHEMA_TAGS.waypointElevation
    );
    if (elevation) {
      waypointSample.setMeasurement(MEASUREMENT_KEYS.elevation, elevation);
    }

    const wptName = this._tagValue(waypointNode, SCHEMA_TAGS.waypointName);
    if (wptName != null) {
      waypoint.setAttribute(ATTRIBUTE_KEYS.activityName, wptName);
    }

    waypointSeries.addSample(waypointSample);
    waypoint.addSeries(waypointSeries);
    return waypoint;
  }

  _tagValue = (parentNode, tagName) => {
    const subNode = parentNode.getElementsByTagName(tagName);
    return subNode.length > 0 ? subNode[0].childNodes[0].nodeValue : null;
  }
}

GpxActivityFactory.DETAIL = DETAIL;
GpxActivityFactory.GPX_TYPE = GPX_TYPE;
GpxActivityFactory.SCHEMA_TAGS = SCHEMA_TAGS;

export default GpxActivityFactory;
