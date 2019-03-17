// @flow

import moment from 'moment';
import secondsToTime from './secondsToTime';

/**
 * calculatePace.js
 *
 * Calculates the pace per mile/km, formatted as 'm:ss'
 */
function calculatePace(dist: number | string, seconds: number): string {
  // Ensure distance is a number.
  const distance = parseFloat(dist);

  if (!distance || !seconds) {
    // If distance hasn't been entered or has a value of zero, the
    // calculation will come back invalid. No time will just be zero.
    // In either case, just return '0:00' as the pace.
    return secondsToTime(0);
  }

  return secondsToTime(
    moment.duration(seconds / distance, 's').asSeconds()
  );
}

export default calculatePace;
