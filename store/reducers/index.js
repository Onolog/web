// @flow

import {connectRouter} from 'connected-react-router';
import {combineReducers} from 'redux';

import activities from './activitiesReducer';
import brands from './brandsReducer';
import garminActivity from './garminActivityReducer';
import pendingRequests from './pendingRequestsReducer';
import searchResults from './searchResultsReducer';
import session from './sessionReducer';
import shoes from './shoesReducer';
import ui from './uiReducer';
import user from './userReducer';

import type {History} from '../../types/History';

export default (history: History) => combineReducers({
  activities,
  brands,
  garminActivity,
  pendingRequests,
  router: connectRouter(history),
  searchResults,
  session,
  shoes,
  ui,
  user,
});
