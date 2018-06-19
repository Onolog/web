// @flow

/**
 * cloneDate.js
 *
 * Simple util function for cloning a date object.
 */
export default (date: Date): Date => new Date(date.valueOf());
