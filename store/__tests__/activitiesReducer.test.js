import {expect} from 'chai';

import activitiesReducer from '../reducers/activitiesReducer';
import {getSuccessType} from '../../utils/actionTypes';
import ActionTypes from '../../constants/ActionTypes';

const ACTIVITY_1 = {
  id: 0,
  distance: 10.0,
};

const ACTIVITY_2 = {
  id: 1,
  distance: 5.5,
};

const getActivitiesState = (nodes=[]) => ({
  count: nodes.length,
  nodes,
  sumDistance: nodes.reduce((accum, a) => (accum + a.distance), 0),
});

describe('activitiesReducer', () => {
  it('returns a default state', () => {
    expect(activitiesReducer({}, {type: 'FOO'})).to.deep.equal({});
  });

  it('returns the correct state when fetching activities', () => {
    const activities = getActivitiesState([
      ACTIVITY_1,
      ACTIVITY_2,
    ]);

    const action = {
      data: {activities},
      type: getSuccessType(ActionTypes.ACTIVITIES_FETCH),
    };

    expect(activitiesReducer(getActivitiesState(), action))
      .to.deep.equal(activities);
  });
});
