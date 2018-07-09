import {combineReducers} from 'redux';

import activities from './activitiesReducer';
import brands from './brandsReducer';
import shoes from './shoesReducer';

import ActionTypes from '../../constants/ActionTypes';
import {getBaseType, getSuccessType, isBaseType} from '../../utils/actionTypes';

const garminActivityReducer = (state={}, action) => {
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

const navigationReducer = (state={}, action) => {
  switch (action.type) {
    case ActionTypes.NAV_TOGGLE:
      return {
        ...state,
        sideNavOpen: action.sideNavOpen,
      };
    default:
      return state;
  }
};

const pendingRequestsReducer = (state={}, {type}) => {
  // Filter out any actions that are not whitelisted.
  if (!ActionTypes[type]) {
    return state;
  }

  if (isBaseType(type)) {
    return {
      ...state,
      [type]: true,
    };
  }

  return {
    ...state,
    [getBaseType(type)]: false,
  };
};

const sessionReducer = (state={}, action) => {
  switch (action.type) {
    case getSuccessType(ActionTypes.SESSION_INITIALIZE):
      return action.session;
    case getSuccessType(ActionTypes.USER_UPDATE):
      // Update session data if user settings change.
      const user = action.data.updateUser;
      if (user.id === state.user.id) {
        return {
          ...state,
          user: {
            ...state.user,
            ...user,
          },
        };
      }
      return state;
    default:
      return state;
  }
};

const userReducer = (state={}, action) => {
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
  pendingRequests: pendingRequestsReducer,
  session: sessionReducer,
  shoes,
  user: userReducer,
});
