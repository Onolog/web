// @flow

import ActionTypes from '../../constants/ActionTypes';
import { getSuccessType } from '../../utils/actionTypes';

import type { Action } from '../../types/Action';

export default (state: Array<?Object> = [], action: Action): Array<?Object> => {
  switch (action.type) {
    case getSuccessType(ActionTypes.ACTIVITIES_SEARCH):
      return action.data.activities.nodes;
    default:
      return state;
  }
};
