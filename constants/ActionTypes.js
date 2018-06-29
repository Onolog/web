import {getErrorType, getSuccessType} from '../utils/actionTypes';

// TODO: Generate once on app initialization.
const ActionTypes = [
  // Collections
  'ACTIVITIES_FETCH',
  'BRANDS_FETCH',
  'SHOES_FETCH',

  // Instances
  'ACTIVITY_CREATE',
  'ACTIVITY_DELETE',
  'ACTIVITY_FETCH',
  'ACTIVITY_UPDATE',
  'SHOE_CREATE',
  'SHOE_DELETE',
  'SHOE_UPDATE',
  'SHOE_FETCH',
  'GARMIN_ACTIVITY_FETCH',
  'USER_FETCH',
  'USER_UPDATE',

  // UI/App
  'ACTIVITY_MODAL_HIDE',
  'ERROR_CLEAR',
  'NAV_TOGGLE',
  'SESSION_INITIALIZE',
].reduce((obj, type) => {
  obj[type] = type;
  obj[getErrorType(type)] = getErrorType(type);
  obj[getSuccessType(type)] = getSuccessType(type);
  return obj;
}, {});

export default ActionTypes;
