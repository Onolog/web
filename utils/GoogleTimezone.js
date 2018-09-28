// @flow

import fetch from 'isomorphic-fetch';
import {stringify} from 'qs';

import {TIMEZONE_API_KEY} from '../constants/Google';

const BASE_URL = 'https://maps.googleapis.com/maps/api/timezone/json';

/**
 * GoogleTimezone
 *
 * Retrieves timezone information from the Google Maps Timezone API given
 * location and time data.
 */
export default function(params: Object, callback: Function): void {
  const queryString = stringify({
    location: params.latitude + ',' + params.longitude,
    timestamp: params.timestamp,
    key: TIMEZONE_API_KEY,
  });

  fetch(`${BASE_URL}?${queryString}`)
    .then((res) => res.json())
    .then(callback);
}
