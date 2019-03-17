/* eslint-disable no-case-declarations */

// @flow

import ActionTypes from '../../constants/ActionTypes';
import { getSuccessType } from '../../utils/actionTypes';

import type { Action } from '../../types/Action';

const activityReducer = (state: Object = {}, action: Action): Object => {
  let activity;

  switch (action.type) {
    case getSuccessType(ActionTypes.ACTIVITY_FETCH):
      const { activities } = action.data;
      activity = activities && activities.nodes && activities.nodes[0];
      return state.id === activity.id ? { ...state, ...activity } : state;
    case getSuccessType(ActionTypes.ACTIVITY_UPDATE):
      activity = action.data.updateActivity;
      return state.id === activity.id ? { ...state, ...activity } : state;
    default:
      return state;
  }
};

export default (state: Object = {}, action: Action): Object => {
  let nodes;

  switch (action.type) {
    case getSuccessType(ActionTypes.ACTIVITIES_FETCH):
      return action.data.activities;
    case getSuccessType(ActionTypes.ACTIVITY_CREATE):
      nodes = [...state.nodes, action.data.createActivity];
      return {
        count: nodes.length,
        nodes,
      };
    case getSuccessType(ActionTypes.ACTIVITY_DELETE):
      const activityId = parseInt(action.data.deleteActivity, 10);
      nodes = state.nodes.filter((a) => a.id !== activityId);
      return {
        count: nodes.length,
        nodes,
      };
    case getSuccessType(ActionTypes.ACTIVITY_UPDATE):
    case getSuccessType(ActionTypes.ACTIVITY_FETCH):
      // TODO: This currently updates an existing activity, but doesn't account
      // for fetching an activity that isn't already part of the state.
      nodes = state.nodes.map((a) => activityReducer(a, action));
      return {
        count: nodes.length,
        nodes,
      };
    case getSuccessType(ActionTypes.USER_FETCH):
      const { activities } = action.data.user;
      return activities || state;
    default:
      return state;
  }
};
