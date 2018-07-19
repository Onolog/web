// @flow

import {groupBy, head, last, range, reduce} from 'lodash';
import moment from 'moment-timezone';

import type {Activity} from '../types/Activity';

type Activities = Array<Activity>;
type TimeUnit = 'year' | 'month' | 'week' | 'dayOfYear';

/**
 * Activity Utils
 *
 * A series of functions for grouping and manipulating activity data.
 */

/**
 * Provides standard top-level metrics for a grouping of activities.
 */
export function getGroupingInfo(activities: Activities): Object {
  return {
    activityCount: activities.length,
    distance: getAggregateDistance(activities),
    duration: getAggregateDuration(activities),
  };
}

/**
 * Calculates the total distance across an array of activities.
 */
export function getAggregateDistance(activities: Activities): number {
  return +reduce(activities, (total, a) => +total + +a.distance, 0).toFixed(2);
}

/**
 * Calculates the total duration across an array of activities.
 */
export function getAggregateDuration(activities: Activities): number {
  return reduce(activities, (total, a) => +total + +a.duration, 0);
}

/**
 * Get the value of a particular date unit. For example:
 *
 *    - year
 *    - month
 *    - week
 *    - date
 *    - day
 *    - hour
 *    - minute
 *    - second
 *    - millisecond
 */
function _getDateValue(unit: TimeUnit, activity: Activity): number {
  return moment.tz(activity.startDate, activity.timezone).get(unit);
}

/**
 * Find the range of time for which there could be an activity and get the
 * full range of units in between.
 */
function _getRange(unit: TimeUnit, activities: Activities): Array<number> {
  // TODO: Find a better fallback for this scenario.
  if (!activities.length) {
    return range(1, 53);
  }

  let min;
  let max;
  let {startDate, timezone} = head(activities);

  switch (unit) {
    case 'year':
      // From the earliest year in the set of activities to the current year.
      min = _getDateValue(unit, last(activities));
      max = (new Date()).getFullYear();
      break;
    case 'month':
      // There are always 12 months in a year.
      min = 0;
      max = 11;
      break;
    case 'week':
      // We expect all activities here to be from a single year.
      // Find the number of weeks in that year.
      min = 1;
      // TODO: Use `moment.isoWeeksInYear()` instead?
      max = moment.tz(startDate, timezone).weeksInYear();
      break;
    case 'dayOfYear':
      min = 1;
      max = moment.tz(startDate, timezone).isLeapYear() ? 366 : 365;
      break;
  }

  return range(min, max + 1);
}

/**
 * Given a flat array of activities, groups them by the given unit of time.
 * For anything other than 'year', it's assumed that all the activities are in
 * the same year.
 */
function _groupBy(unit: TimeUnit, activities: Activities): Object {
  // Group the activities by the desired unit of time.
  const range = _getRange(unit, activities);
  activities = groupBy(activities, _getDateValue.bind(null, unit));

  // Create the shell object keyed by unit of time.
  const grouped = {};
  range.forEach((value) => grouped[value] = []);

  // Merge the shell object with the grouped activities.
  return {...grouped, ...activities};
}

export const groupActivities = {
  byYear: (activities: Activities) => _groupBy('year', activities),
  byMonth: (activities: Activities) => _groupBy('month', activities),
  byWeek: (activities: Activities) => _groupBy('week', activities),
  byDay: (activities: Activities) => _groupBy('dayOfYear', activities),
};
