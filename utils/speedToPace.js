// @flow

import {METERS_PER_KM, METERS_PER_MILE} from '../constants/metrics';

/**
 * Converts speed (in meters/second) to pace (in seconds/mile or seconds/km).
 */
export default function speedToPace(
  speed: number,
  useMetric: boolean = false
): number {
  return (useMetric ? METERS_PER_KM : METERS_PER_MILE) / speed;
}
