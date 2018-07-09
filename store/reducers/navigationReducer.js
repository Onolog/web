import ActionTypes from '../../constants/ActionTypes';
import type {Action} from '../../types/Action';

export default (state: Object={}, action: Action): Object => {
  switch (action.type) {
    case ActionTypes.NAV_TOGGLE:
      return {
        ...state,
        sideNavOpen: action.data.sideNavOpen,
      };
    default:
      return state;
  }
};
