// @flow

import moment from 'moment';
import pad from './pad';

/**
 * Formats given number of seconds into the following:
 *
 *    'hh:mm:ss'
 *    'm:ss'
 */
export default function secondsToTime(seconds) {
  const time = moment.duration(parseInt(seconds, 10), 's');
  const timeArr = [];
  const dd = time.days();

  let hh = time.hours();
  let mm = time.minutes();

  // If the time is more than a day, calculate the total number of hours
  if (dd) {
    hh += dd*24;
  }

  if (hh) {
    timeArr.push(hh);
    mm = pad(mm);
  }
  timeArr.push(mm);
  timeArr.push(pad(time.seconds()));

  return timeArr.join(':');
}
