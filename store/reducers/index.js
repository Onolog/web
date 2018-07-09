// @flow

import {combineReducers} from 'redux';

import activities from './activitiesReducer';
import brands from './brandsReducer';
import garminActivity from './garminActivityReducer';
import navigation from './navigationReducer';
import pendingRequests from './pendingRequestsReducer';
import session from './sessionReducer';
import shoes from './shoesReducer';
import user from './userReducer';

export default combineReducers({
  activities,
  brands,
  garminActivity,
  navigation,
  pendingRequests,
  session,
  shoes,
  user,
});
