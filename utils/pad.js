// @flow

import { padStart } from 'lodash';

/**
 * pad.js
 *
 * Adds leading zeroes to numeric values.
 */
export default (value: number): string => padStart(value, 2, '0');
