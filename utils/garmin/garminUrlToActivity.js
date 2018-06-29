// @flow

import moment from 'moment';
import {metersToFeet, metersToMiles} from '../distanceUtils';

import type {Activity} from '../../types/Activity';

/**
 * Normalizes activity data pulled from Garmin's endpoints.
 */
function garminUrlToActivity(data: Object): Activity {
  const {activity} = data;
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

  return {
    activityType: activity.activityTypeDTO.typeKey,
    avgHr: averageHR,
    // TODO: Accept decimal values?
    calories: calories && Math.round(calories),
    distance: metersToMiles(distance),
    // TODO: Accept decimal values?
    duration: Math.round(duration),
    elevationGain: metersToFeet(elevationGain),
    elevationLoss: metersToFeet(elevationLoss),
    garminActivityId: activity.activityId,
    maxHr: maxHR,
    startDate: moment(startTimeLocal).format(),
    timezone: activity.timeZoneUnitDTO.timeZone,

    // TODO: Add these models to the schema.
    // device: {},
    // laps: splits.lapDTOs,
    // tracks: [],
  };
}

export default garminUrlToActivity;
