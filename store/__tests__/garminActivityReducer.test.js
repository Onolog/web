import { expect } from 'chai';

import garminActivityReducer from '../reducers/garminActivityReducer';
import { getSuccessType } from '../../utils/actionTypes';

import ActionTypes from '../../constants/ActionTypes';
import { GARMIN_ACTIVITY, TEST_ACTION } from '../../constants/TestData';

describe('brandsReducer', () => {
  it('returns a default state', () => {
    expect(garminActivityReducer({}, TEST_ACTION)).to.deep.equal({});
  });

  it('returns the state when fetching a Garmin activity', () => {
    const action = {
      data: { garminActivity: GARMIN_ACTIVITY },
      type: getSuccessType(ActionTypes.GARMIN_ACTIVITY_FETCH),
    };

    expect(garminActivityReducer({}, action)).to.equal(GARMIN_ACTIVITY);
  });
});
