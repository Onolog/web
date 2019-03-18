import garminActivityReducer from '../reducers/garminActivityReducer';
import { getSuccessType } from '../../utils/actionTypes';

import ActionTypes from '../../constants/ActionTypes';
import { GARMIN_ACTIVITY, TEST_ACTION } from '../../constants/TestData';

describe('brandsReducer', () => {
  test('returns a default state', () => {
    expect(garminActivityReducer({}, TEST_ACTION)).toEqual({});
  });

  test('returns the state when fetching a Garmin activity', () => {
    const action = {
      data: { garminActivity: GARMIN_ACTIVITY },
      type: getSuccessType(ActionTypes.GARMIN_ACTIVITY_FETCH),
    };

    expect(garminActivityReducer({}, action)).toBe(GARMIN_ACTIVITY);
  });
});
