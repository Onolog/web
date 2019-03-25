// @flow

import ActionTypes from '../../constants/ActionTypes';
import { getSuccessType } from '../../utils/actionTypes';

import type { Action } from '../../types/Action';

export default (state: Object = {}, action: Action): Object => {
  switch (action.type) {
    case ActionTypes.ACTIVITY_MODAL_HIDE:
      // Reset data.
      return {};
    case getSuccessType(ActionTypes.GARMIN_ACTIVITY_FETCH):
      return action.data.garminActivity;
    default:
      return state;
  }
};
