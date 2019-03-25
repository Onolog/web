import { getErrorType, getSuccessType } from '../utils/actionTypes';

// TODO: Generate once on app initialization.
const ActionTypes = [
  // Collections
  'ACTIVITIES_FETCH',
  'ACTIVITIES_SEARCH',
  'BRANDS_FETCH',
  'SHOES_FETCH',

  // Instances
  'ACTIVITY_CREATE',
  'ACTIVITY_DELETE',
  'ACTIVITY_FETCH',
  'ACTIVITY_UPDATE',
  'SHOE_CREATE',
  'SHOE_DELETE',
  'SHOE_FETCH',
  'SHOE_UPDATE',
  'GARMIN_ACTIVITY_FETCH',
  'USER_FETCH',
  'USER_UPDATE',

  // UI/App
  'ACTIVITY_MODAL_SHOW',
  'ACTIVITY_MODAL_HIDE',
  'ERROR_CLEAR',
  'NAV_TOGGLE',
  'SESSION_INITIALIZE',
].reduce((obj, type) => ({
  ...obj,
  [type]: type,
  [getErrorType(type)]: getErrorType(type),
  [getSuccessType(type)]: getSuccessType(type),
}), {});

export default ActionTypes;
