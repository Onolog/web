import {expect} from 'chai';

import activitiesReducer from '../reducers/activitiesReducer';
import {getSuccessType} from '../../utils/actionTypes';
import ActionTypes from '../../constants/ActionTypes';
import {ACTIVITIES, TEST_ACTION} from '../../constants/TestData';

const getActivitiesState = (nodes=[]) => ({
  count: nodes.length,
  nodes,
});

describe('activitiesReducer', () => {
  let state;

  beforeEach(() => {
    state = getActivitiesState([ACTIVITIES[0], ACTIVITIES[1]]);
  });

  it('returns a default state', () => {
    expect(activitiesReducer({}, TEST_ACTION)).to.deep.equal({});
  });

  it('returns the state when fetching activities', () => {
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

  it('returns the state when fetching a single activity', () => {
    const updatedActivity = {...ACTIVITIES[1], notes: 'test'};
    const action = {
      data: {activities: getActivitiesState([updatedActivity])},
      type: getSuccessType(ActionTypes.ACTIVITY_FETCH),
    };

    expect(activitiesReducer(state, action))
      .to.deep.equal(getActivitiesState([ACTIVITIES[0], updatedActivity]));
  });

  it('returns the state when creating an activity', () => {
    const action = {
      data: {createActivity: ACTIVITIES[1]},
      type: getSuccessType(ActionTypes.ACTIVITY_CREATE),
    };

    expect(activitiesReducer(getActivitiesState([ACTIVITIES[0]]), action))
      .to.deep.equal(getActivitiesState([ACTIVITIES[0], ACTIVITIES[1]]));
  });

  it('returns the state when deleting an activity', () => {
    const action = {
      data: {deleteActivity: ACTIVITIES[0].id},
      type: getSuccessType(ActionTypes.ACTIVITY_DELETE),
    };

    expect(activitiesReducer(state, action))
      .to.deep.equal(getActivitiesState([ACTIVITIES[1]]));
  });

  it('returns the state when updating an activity', () => {
    const updatedActivity = {...ACTIVITIES[1], notes: 'test'};
    const action = {
      data: {updateActivity: updatedActivity},
      type: getSuccessType(ActionTypes.ACTIVITY_UPDATE),
    };

    expect(activitiesReducer(state, action))
      .to.deep.equal(getActivitiesState([ACTIVITIES[0], updatedActivity]));
  });
});
