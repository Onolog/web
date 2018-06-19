import {head, last, values} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {findDOMNode} from 'react-dom';

import isBrowser from '../../utils/isBrowser';

import {API_KEY} from '../../constants/Google';

const dataShape = {
  lat: PropTypes.number.isRequired,
  lng: PropTypes.number.isRequired,
};

// Default values: Los Altos, CA
const DEFAULT_LATITUDE = 37.3682;
const DEFAULT_LONGITUDE = -122.098;
const DEFAULT_ZOOM = 12;

// Matches the types in `google.maps.MapTypeId`.
const MAP_TYPES = {
  HYBRID: 'hybrid',
  ROADMAP: 'roadmap',
  SATELLITE: 'satellite',
  TERRAIN: 'terrain',
};

class GoogleMap extends React.Component {

  cursor = null;

  componentDidMount() {
    if (!isBrowser()) {
      return;
    }

    const GoogleMapsLoader = require('google-maps');

    GoogleMapsLoader.KEY = API_KEY;
    GoogleMapsLoader.LIBRARIES = ['geometry'];
    GoogleMapsLoader.load((google) => {
      // Make Google Maps API globally available.
      window.google = google;
      this._drawMap();
    });
  }

  componentWillReceiveProps(nextProps) {
    // Only re-draw the map if the path changes.
    if (window.google && nextProps.path.length !== this.props.path.length) {
      this._drawMap();
      return;
    }

    this._updateCursor(nextProps);
  }

  render() {
    return (
      <div
        className={this.props.className}
        ref={(instance) => this._instance = instance}
      />
    );
  }

  _drawMap = () => {
    if (!this._instance) {
      return;
    }

    const {mapTypeId, path} = this.props;
    const {Map, Marker, Point, Polyline, Size} = window.google.maps;

    const map = new Map(findDOMNode(this._instance), {
      zoom: DEFAULT_ZOOM,
      center: {lat: DEFAULT_LATITUDE, lng: DEFAULT_LONGITUDE},
      mapTypeId,
      streetViewControl: false,
    });

    // Center map and set zoom level based on the bounds of the path.
    const bounds = this._getBoundsForPath(path);
    map.setCenter(bounds.getCenter());
    map.fitBounds(bounds);

    const icon = {
      anchor: new Point(6, 6),
      origin: new Point(0, 0),
      scaledSize: new Size(12, 12),
    };

    // Add start/finish markers
    new Marker({
      icon: {
        ...icon,
        url: '/webroot/img/markerStart.png',
      },
      map,
      position: head(path),
    });

    new Marker({
      icon: {
        ...icon,
        url: '/webroot/img/markerEnd.png',
      },
      map,
      position: last(path),
    });

    // Create and set the polyline.
    this.polyline = new Polyline({
      map,
      path,
      strokeColor: '#ff0000',
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    this.polyline.addListener('mousemove', this._handlePolylineMouseMove);

    this.cursor = new Marker({
      icon: {
        anchor: new Point(9, 9),
        origin: new Point(0, 0),
        scaledSize: new Size(18, 18),
        url: '/webroot/img/markerPosition.png',
      },
      map,
      zIndex: 100,
    });

    this._updateCursor(this.props);
  };

  _handlePolylineMouseMove = (e) => {
    if (!this.props.onPolylineMouseMove) {
      return;
    }

    const {computeDistanceBetween} = window.google.maps.geometry.spherical;
    const path = this.polyline.getPath().getArray();

    let index = -1;
    let minDistance = 1000;

    // Find the point on the line closest to the hovered point.
    path.forEach((point, idx) => {
      const d = computeDistanceBetween(e.latLng, point);

      if (d < minDistance) {
        minDistance = d;
        index = idx;
      }
    });

    this.props.onPolylineMouseMove(index);
  }

  _updateCursor = ({cursorPos}) => {
    this.cursor.setPosition(cursorPos);
  }

  _getBoundsForPath = (path) => {
    const {LatLngBounds, LatLng} = window.google.maps;
    const bounds = new LatLngBounds();
    for (let ii = 0; ii < path.length-1; ii++) {
      bounds.extend(new LatLng(path[ii]));
    }
    return bounds;
  };
}

GoogleMap.propTypes = {
  cursorPos: PropTypes.shape(dataShape),
  mapTypeId: PropTypes.oneOf(values(MAP_TYPES)),
  onPolylineMouseMove: PropTypes.func,
  path: PropTypes.arrayOf(
    PropTypes.shape(dataShape).isRequired
  ).isRequired,
};

GoogleMap.defaultProps = {
  mapTypeId: MAP_TYPES.TERRAIN,
};

GoogleMap.MAP_TYPES = MAP_TYPES;

export default GoogleMap;
