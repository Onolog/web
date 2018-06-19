import {getErrorType, getSuccessType} from '../utils/actionTypes';

// TODO: Generate once on app initialization.
const ActionTypes = [
  'ACTIVITIES_FETCH',
  'ACTIVITY_ADD',
  'ACTIVITY_DELETE',
  'ACTIVITY_FETCH',
  'ACTIVITY_UPDATE',
  'SHOE_ADD',
  'SHOE_DELETE',
  'SHOE_UPDATE',
  'SHOE_FETCH',
  'SHOE_ACTIVITIES_FETCH',
  'BRANDS_FETCH',
  'GARMIN_ACTIVITY_FETCH',
  'SHOES_FETCH',
  'SESSION_INITIALIZE',
  'USER_FETCH',
  'USER_UPDATE',
  'ACTIVITY_MODAL_HIDE',
  'ERROR_CLEAR',
  'NAV_TOGGLE',
].reduce((obj, type) => {
  obj[type] = type;
  obj[getErrorType(type)] = getErrorType(type);
  obj[getSuccessType(type)] = getSuccessType(type);
  return obj;
}, {});

export default ActionTypes;
