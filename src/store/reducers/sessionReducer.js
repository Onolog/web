/* eslint-disable no-case-declarations */

// @flow

import { getSuccessType } from '../../utils/actionTypes';
import ActionTypes from '../../constants/ActionTypes';

import type { Action } from '../../types/Action';

export default (state: Object = {}, action: Action): Object => {
  switch (action.type) {
    case getSuccessType(ActionTypes.SESSION_INITIALIZE):
      return action.data.session;
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
