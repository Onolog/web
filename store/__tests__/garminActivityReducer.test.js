import {expect} from 'chai';

import garminActivityReducer from '../reducers/garminActivityReducer';
import {getSuccessType} from '../../utils/actionTypes';

import ActionTypes from '../../constants/ActionTypes';
import {GARMIN_ACTIVITY} from '../../constants/TestData';

describe('brandsReducer', () => {
  it('returns a default state', () => {
    expect(garminActivityReducer({}, {type: 'FOO'})).to.deep.equal({});
  });

  it('returns the state when fetching a Garmin activity', () => {
    const action = {
      data: {garminActivity: GARMIN_ACTIVITY},
      type: getSuccessType(ActionTypes.GARMIN_ACTIVITY_FETCH),
    };

    expect(garminActivityReducer({}, action)).to.equal(GARMIN_ACTIVITY);
  });
});
