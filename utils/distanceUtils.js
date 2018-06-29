// @flow

import {FEET_PER_METER, METERS_PER_KM, METERS_PER_MILE, UNITS} from '../constants/metrics';
import type {DistanceUnits} from '../types/DistanceUnits';

/**
 * distanceUtils.js
 *
 * Convert distances, generally from metric to English
 */

export function convertDistance(miles: number, units: DistanceUnits) {
  return units === UNITS.KILOMETERS ? milesToKilometers(miles) : miles;
}

export function metersToMiles(
  distanceInMeters: number,
  precision: number = 2
): number {
  const miles = distanceInMeters / METERS_PER_MILE;

  // Round to x decimal places.
  // See:
  //  - https://stackoverflow.com/questions/11832914/round-to-at-most-2-decimal-places-in-javascript
  //  - https://stackoverflow.com/questions/10015027/javascript-tofixed-not-rounding/32605063#32605063
  return +(Math.round(+(miles + 'e' + precision)) + 'e' + -precision);
}

export function metersToFeet(distanceInMeters: number): number {
  return +(Math.round(distanceInMeters * FEET_PER_METER));
}

export function milesToKilometers(miles: number) {
  return (miles * METERS_PER_MILE) / METERS_PER_KM;
}
