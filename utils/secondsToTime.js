// @flow

const HOURS_PER_DAY = 24;
const SECS_PER_DAY = 60 * 60 * HOURS_PER_DAY;

/**
 * Formats given number of seconds into the following:
 *
 *    'hh:mm:ss'
 *    'm:ss'
 */
export default function secondsToTime(seconds: number): string {
  const arr = new Date(seconds * 1000)
    .toISOString()
    .substr(11, 8)
    .split(':');

  const days = Math.floor(seconds / SECS_PER_DAY);
  const hours = parseInt(arr[0], 10) + days * HOURS_PER_DAY;

  if (hours) {
    arr[0] = '' + hours;
  } else {
    // If we're only dealing with minutes and seconds, don't display hours.
    arr.shift();
    arr[0] = '' + parseInt(arr[0], 10);
  }

  return arr.join(':');
}
