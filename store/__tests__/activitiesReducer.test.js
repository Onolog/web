import {expect} from 'chai';

import activitiesReducer from '../reducers/activitiesReducer';
import {getSuccessType} from '../../utils/actionTypes';
import ActionTypes from '../../constants/ActionTypes';
import {ACTIVITIES, TEST_ACTION} from '../../constants/TestData';

const getActivitiesState = (nodes=[]) => ({
  count: nodes.length,
  nodes,
  sumDistance: nodes.reduce((accum, a) => (accum + a.distance), 0),
});

describe('activitiesReducer', () => {
  it('returns a default state', () => {
    expect(activitiesReducer({}, TEST_ACTION)).to.deep.equal({});
  });

  it('returns the correct state when fetching activities', () => {
    const activities = getActivitiesState([
      ACTIVITIES[0],
      ACTIVITIES[1],
      ACTIVITIES[2],
    ]);

    const action = {
      data: {activities},
      type: getSuccessType(ActionTypes.ACTIVITIES_FETCH),
    };

    expect(activitiesReducer(getActivitiesState(), action))
      .to.deep.equal(activities);
  });
});
