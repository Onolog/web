// @flow

import ActionTypes from '../../constants/ActionTypes';
import {getBaseType, isBaseType} from '../../utils/actionTypes';

export default (state: Object = {}, action: {type: string}): Object => {
  const {type} = action;

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
