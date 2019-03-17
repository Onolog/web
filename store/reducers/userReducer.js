// @flow

import ActionTypes from '../../constants/ActionTypes';
import { getSuccessType } from '../../utils/actionTypes';

import type { Action } from '../../types/Action';

export default (state: Object = {}, action: Action): Object => {
  switch (action.type) {
    case getSuccessType(ActionTypes.USER_FETCH):
      return action.data.user;
    case getSuccessType(ActionTypes.USER_UPDATE):
      // TODO: Check ids?
      return {
        ...state,
        ...action.data.updateUser,
      };
    default:
      return state;
  }
};
