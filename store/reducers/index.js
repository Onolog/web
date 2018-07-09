// @flow

import {combineReducers} from 'redux';

import activities from './activitiesReducer';
import brands from './brandsReducer';
import pendingRequests from './pendingRequestsReducer';
import session from './sessionReducer';
import shoes from './shoesReducer';

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

const navigationReducer = (state: Object={}, action: Action): Object => {
  switch (action.type) {
    case ActionTypes.NAV_TOGGLE:
      return {
        ...state,
        sideNavOpen: action.data.sideNavOpen,
      };
    default:
      return state;
  }
};

const userReducer = (state: Object={}, action: Action): Object => {
  switch (action.type) {
    case getSuccessType(ActionTypes.USER_FETCH):
      return action.data.user;
    case getSuccessType(ActionTypes.USER_UPDATE):
      return {
        ...state,
        ...action.data.updateUser,
      };
    default:
      return state;
  }
};

export default combineReducers({
  activities,
  brands,
  garminActivity: garminActivityReducer,
  navigation: navigationReducer,
  pendingRequests,
  session,
  shoes,
  user: userReducer,
});
