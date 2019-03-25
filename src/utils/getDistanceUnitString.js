// @flow

import invariant from 'invariant';
import { UNITS } from '../constants/metrics';

export default function getDistanceUnitString(
  units: 0 | 1,
  abbr: ?boolean
): string {
  switch (units) {
    case UNITS.KILOMETERS:
      return abbr ? 'km' : 'kilometers';
    case UNITS.MILES:
      return abbr ? 'mi' : 'miles';
    default:
      invariant(
        false,
        `Invalid unit of distance supplied (${units}). Must either be ` +
        'miles (0) or kilometers (1).'
      );
  }
}
