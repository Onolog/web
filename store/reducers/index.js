import {combineReducers} from 'redux';

import ActionTypes from '../../constants/ActionTypes';
import {getBaseType, getSuccessType, isBaseType} from '../../utils/actionTypes';

const activitiesReducer = (state={}, action) => {
  switch (action.type) {
    case getSuccessType(ActionTypes.ACTIVITIES_FETCH):
      return action.data.activities;
    case getSuccessType(ActionTypes.USER_FETCH):
      const {activities} = action.data.user;
      return activities || state;
    default:
      return state;
  }
};

const brandsReducer = (state=[], action) => {
  switch (action.type) {
    case getSuccessType(ActionTypes.BRANDS_FETCH):
      return action.data.brands;
    default:
      return state;
  }
};

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

const shoe = (state={}, action) => {
  switch (action.type) {
    case getSuccessType(ActionTypes.SHOE_UPDATE):
    case getSuccessType(ActionTypes.SHOE_FETCH):
      const {shoes} = action.data;
      const shoe = shoes && shoes.nodes && shoes.nodes[0];
      return state.id === shoe.id ? {...state, ...shoe} : state;
    default:
      return state;
  }
};

const shoesReducer = (state={}, action) => {
  switch (action.type) {
    case getSuccessType(ActionTypes.SHOES_FETCH):
      return action.data.shoes;
    case getSuccessType(ActionTypes.SHOE_UPDATE):
    case getSuccessType(ActionTypes.SHOE_FETCH):
      return {
        ...state,
        nodes: state.nodes.map((s) => shoe(s, action)),
      };
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
  activities: activitiesReducer,
  brands: brandsReducer,
  garminActivity: garminActivityReducer,
  navigation: navigationReducer,
  pendingRequests: pendingRequestsReducer,
  session: sessionReducer,
  shoes: shoesReducer,
  user: userReducer,
});
