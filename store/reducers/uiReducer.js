// @flow

import ActionTypes from '../../constants/ActionTypes';
import type {Action} from '../../types/Action';

export default (state: Object={}, action: Action): Object => {
  switch (action.type) {
    case ActionTypes.ACTIVITY_MODAL_SHOW:
      return {
        ...state,
        activityModal: {
          ...action.data,
          show: true,
        },
      };
    case ActionTypes.ACTIVITY_MODAL_HIDE:
      return {
        ...state,
        activityModal: {
          show: false,
        },
      };
    case ActionTypes.NAV_TOGGLE:
      return {
        ...state,
        sideNavOpen: action.data.sideNavOpen,
      };
    default:
      return state;
  }
};
