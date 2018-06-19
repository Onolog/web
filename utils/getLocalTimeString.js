// @flow

import moment from 'moment';

/**
 * getLocalTimeString.js
 *
 * Returns an ISO string with the local time + offset, instead of UTC.
 */
export default function(date: Date): string {
  return moment(date).format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
}
