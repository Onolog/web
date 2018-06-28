/** Copyright &copy; 2007-2010 Garmin Ltd. or its subsidiaries.
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
 * @fileoverview GoogleMapController Overlays tracks and waypoint data on Google maps.
 * @version 1.9
 */
var GarminSample = require('../activity/GarminSample');
var GarminMapIcons = require('./GarminMapIcons');

// Default values: Los Altos, CA
var LATITUDE = 37.3682;
var LONGITUDE = -122.098;
var MEASUREMENT_KEYS = GarminSample.MEASUREMENT_KEYS;

/**
 * Accepts GarminSeries objects and draws them on a Google Map.
 * 
 * @class GoogleMapController
 * @constructor 
 * @param (String) mapString id of element to place map in
 */
var GoogleMapController = function(map) {
  this.mapElement = map;
  this.usePositionMarker = true;

  this.markers = [];
  this.tracks = [];
  this.markerIndex = 0;

  this.map = this.getMap();

  window.onUnload = "GUnload()";
};

GoogleMapController.prototype = {
  getMap: function() {
    var mapOptions = {
      zoom: 12,
      center: new google.maps.LatLng(LATITUDE, LONGITUDE),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    FB.getLoginStatus(function(response) {
      if (response.status === 'connected') {
        FB.api('/me', { fields: 'location' }, function(response) {
          FB.api(response.location.id, { fields: 'location' }, function(response) {
            mapOptions.center = new google.maps.LatLng(
              response.location.latitude,
              response.location.longitude
            );
          }.bind(this));
        });
      }
    }.bind(this));

    return new google.maps.Map(this.mapElement, mapOptions);
  },

  /**
   * Set the center point and zoom level of the map.
   * @param (Number) Latitude of the center point
   * @param (Number) Longitude of the center point
   * @param (Number) Zoom level
   */
  centerAndScale: function(lat, lon, scale) {
  	scale = (scale == null ? 13 : scale);
    this.map.setCenter(new google.maps.LatLng(lat, lon), scale);
  },

  /**
   * Draw track on map.
   * @param (GarminTrack) The track to draw
   * @param (String) Color in RGB Hex format, default: "#ff0000"
   */    
  drawTrack: function(series, color) {
    // create a smaller version of the whole track
    // create 300 points or so ...
    // Problem is that Google Maps dies when you hit near 500 points, so we have to
    // ensure that we create fewer than that for the track.
    var drawAt = Math.ceil(series.getSamplesLength() / 300);
    var drawnPoints = [];

    // create up to 300 points
    for (var h = 0; h < series.getSamplesLength(); h += drawAt) {
		  drawnPoints.push(this.createNearestValidLocationPoint(series, h, -1));
    }

    // create the end point
    drawnPoints.push(this.createNearestValidLocationPoint(
      series,
      series.getSamplesLength() - 1,
      -1
    ));
      
    if (drawnPoints.length > 0) {
      // draw the new smaller version
      this.centerAndScale(drawnPoints[0].lat(), drawnPoints[0].lng());
      this.addStartFinishMarkers(series);

      // Draw the route
      this.track = new google.maps.Polyline({
        path: drawnPoints,
        map: this.map,
        strokeColor: color || "#ff0000",
        strokeWeight: 2,
        strokeOpacity: .8
      });

      this.bounds = this.findAZoomLevel(drawnPoints);
      this.setOnBounds(this.bounds);
    }
  },

	/**
	 * Creates a GLatLng for the sample in the series closest to the index with a valid location (lat and lon).
	 * @param series - The series to search through.
	 * @param index - The index to start searching from.
	 * @param incDirection - The direction to travel for the search.
	 * @return A GLatLng of the nearest valid location sample found.
	 */
	createNearestValidLocationPoint: function(series, index, incDirection) {
  	var sample = series.findNearestValidLocationSample(index, -1);
  	if (sample != null) {
  		var sampleLat = sample.getMeasurement(
        MEASUREMENT_KEYS.latitude
      ).getValue();
  		var sampleLon = sample.getMeasurement(
        MEASUREMENT_KEYS.longitude
      ).getValue();
  		return new google.maps.LatLng(sampleLat, sampleLon);    		
  	} else {
		  throw new Error("No valid location point in series.");
  	}
	},

  /**
   * Draw waypoint on map.
   * @param (GarminSeries) series containing a waypoint to add to the map
   */
  drawWaypoint: function(series) {
  	var sample = series.getSample(0);
    this.centerAndScale(sample.getLatitude(), sample.getLongitude(), 15);
    this.addMarker(sample.getLatitude(), sample.getLongitude());
  },

  /**
   * Calculates minimum bounding box for an set of points.
   * @param (Array) The array of points to find a zoom level for
   */
  findAZoomLevel: function(points) {
    var bounds = new google.maps.LatLngBounds(points[0], points[0]);      
    for (var ii=1; ii < points.length-1; ii+=3) {
      bounds.extend(points[ii]);
    }
    return bounds;
  },

	/**
	 * Check the new dimensions of the map, and determine the bounds of the tracks
	 * Then set the map to zoom to that bound level
   * @private
	 */
  sizeAndSetOnBounds: function() {
    this.map.checkResize();
    this.setOnBounds(this.bounds);
  },

  /**
   * Set the bounding box on the map.
   * @param (GLatLngBounds) bounding box for the
   */
  setOnBounds: function(bounds) {
    this.map.setCenter(
      bounds.getCenter(),
      this.map.fitBounds(bounds)
    );
  },
  
  /**
   * Add an icon to a point.
   * @param {Number} latitude of marker
   * @param {Number} longitude of marker
   */
  addMarker: function(latitude, longitude) {
  	this.addMarkerWithIcon(
      latitude,
      longitude,
      GarminMapIcons.getRedIcon()
    );
  },

  /**
   * Adds a marker to the point with the icon specified
   * @param {Number} latitude of marker
   * @param {Number} longitude of marker
   * @param (GIcon) icon to add at the point
   */
  addMarkerWithIcon: function(latitude, longitude, icon) {
    var marker = new google.maps.Marker({
      position: new google.maps.LatLng(latitude, longitude),
      map: this.map,
      icon: icon
    });

    this.markers.push(marker);
    // this.map.addOverlay(marker); v2
    // marker.setMap(this.map);
  },

  /**
   * Add start and finish markers to a track
   * @param (GarminSeries) The series to add markers to
   */
  addStartFinishMarkers: function(series) {
  	var firstSample = series.getFirstValidLocationSample();
    this.addMarkerWithIcon(
      firstSample.getLatitude(),
      firstSample.getLongitude(),
      GarminMapIcons.getGreenIcon()
    );

  	var lastSample = series.getLastValidLocationSample();
    this.addMarkerWithIcon(
      lastSample.getLatitude(),
      lastSample.getLongitude(),
      GarminMapIcons.getRedIcon()
    );
  },

  /**
   * String representation of map.
   * @return (String)
   */
  toString: function() {
    return "Google Based Map Controller, managing " + this.tracks.length + " track(s)";
  },

  /**
   * Clears all the markers and tracks on the map
   */
  clearOverlays: function() {
    // Clear any markers
    for (var ii=0; ii < this.markers.length; ii++) {
      this.markers[ii].setMap(null);
    }
    this.markers.length = 0;

    // Clear the track
    this.track && this.track.setMap(null);
  }
};

module.exports = GoogleMapController;
