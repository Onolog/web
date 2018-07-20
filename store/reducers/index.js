// @flow

import {combineReducers} from 'redux';

import activities from './activitiesReducer';
import brands from './brandsReducer';
import garminActivity from './garminActivityReducer';
import pendingRequests from './pendingRequestsReducer';
import session from './sessionReducer';
import shoes from './shoesReducer';
import ui from './uiReducer';
import user from './userReducer';

export default combineReducers({
  activities,
  brands,
  garminActivity,
  pendingRequests,
  session,
  shoes,
  ui,
  user,
});
