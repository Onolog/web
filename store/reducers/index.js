// @flow

import {combineReducers} from 'redux';

import activities from './activitiesReducer';
import brands from './brandsReducer';
import navigation from './navigationReducer';
import pendingRequests from './pendingRequestsReducer';
import session from './sessionReducer';
import shoes from './shoesReducer';
import user from './userReducer';

import ActionTypes from '../../constants/ActionTypes';
import {getSuccessType} from '../../utils/actionTypes';

import type {Action} from '../../types/Action';

const garminActivityReducer = (state: Object={}, action: Action): Object => {
  switch (action.type) {
    // case ActionTypes.ACTIVITY_MODAL_HIDE:
    //   // Reset data.
    //   return {};
    case getSuccessType(ActionTypes.GARMIN_ACTIVITY_FETCH):
      return action.data.garminActivity;
    default:
      return state;
  }
};

export default combineReducers({
  activities,
  brands,
  garminActivity: garminActivityReducer,
  navigation,
  pendingRequests,
  session,
  shoes,
  user,
});
