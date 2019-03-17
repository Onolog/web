/* eslint-disable no-plusplus */

// @flow

import invariant from 'invariant';
import { isInteger } from 'lodash';

const DAYS_IN_WEEK = 7;

function getDate(year: number, month: number, day: number): Date {
  const now = new Date();
  return new Date(
    year,
    month,
    day,
    now.getHours(),
    now.getMinutes(),
    now.getSeconds()
  );
}

/**
 * calendarGrid
 *
 * Given a month and year, returns an array describing how to lay out the
 * full month as a grid.
 */
function calendarGrid(month: number, year: number): Array<Array<Object>> {
  invariant(
    isInteger(month) && isInteger(year),
    'calendarGrid: The month and year must be integers'
  );

  // Number of days in the given month
  const daysInMonth = getDate(year, month + 1, 0).getDate();

  // Numeric representation of the day of the week
  const monthStartDay = getDate(year, month, 1).getDay();

  let day;
  const monthArr = [];
  let weekArr = [];
  let ii = 0; // Day counter

  // Start the month on the right day of the week
  if (monthStartDay !== 0) {
    for (ii = 0; ii < monthStartDay; ii++) {
      // Calculate the days from the previous month to display
      day = ii + 1 - monthStartDay;
      weekArr.push({ date: getDate(year, month, day) });
    }
  }

  // Add all the days in the selected month
  for (day = 1; day <= daysInMonth; day++) {
    // Do we need to start a new week?
    if (ii === 0) {
      weekArr = [];
    }

    // Add the record
    weekArr.push({ date: getDate(year, month, day) });

    ii++;

    // Do we need to end the row?
    if (ii === DAYS_IN_WEEK) {
      // Add the week/row to the month
      monthArr.push(weekArr);
      weekArr = []; // Reset the weekly workout counter
      ii = 0; // Reset counter
    }
  }

  // Is the last week incomplete?
  if (ii > 0) {
    // Add the necessary number of days to complete the week
    // Continue incrementing day; ex: Oct 32nd == Nov. 1st
    for (ii; ii < DAYS_IN_WEEK; ii++, day++) {
      weekArr.push({
        date: getDate(year, month, day),
      });
    }
    monthArr.push(weekArr);
  }

  return monthArr;
}

export default calendarGrid;
