// @flow

import invariant from 'invariant';

/**
 * isSameDay.js
 *
 * Compares two Date objects to determine if they are the same calendar day.
 */
export default function isSameDay(date1: Date, date2: Date): boolean {
  invariant(
    date1 instanceof Date && date2 instanceof Date,
    '[isSameDay.js] The function parameters must be `Date` objects.'
  );

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
