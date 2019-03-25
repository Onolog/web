// @flow

import moment from 'moment';
import { metersToFeet, metersToMiles } from '../distanceUtils';

import type { Activity } from '../../types/Activity';

/**
 * Normalizes activity data pulled from Garmin's endpoints.
 */
function garminUrlToActivity(data: Object): Activity {
  const { activity } = data;
  const {
    averageHR,
    calories,
    distance,
    duration,
    elevationGain,
    elevationLoss,
    maxHR,
    startTimeLocal,
  } = activity.summaryDTO;

  // TODO: Add these models to the schema.
  // device: {},
  // laps: splits.lapDTOs,
  // tracks: [],

  return {
    activityType: activity.activityTypeDTO.typeKey,
    avgHr: averageHR,
    calories: calories && Math.round(calories), // TODO: Accept decimal values?
    distance: metersToMiles(distance),
    duration: Math.round(duration), // TODO: Accept decimal values?
    elevationGain: metersToFeet(elevationGain),
    elevationLoss: metersToFeet(elevationLoss),
    garminActivityId: activity.activityId,
    maxHr: maxHR,
    startDate: moment(startTimeLocal).format(),
    timezone: activity.timeZoneUnitDTO.timeZone,
  };
}

export default garminUrlToActivity;
