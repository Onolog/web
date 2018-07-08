import ActionTypes from '../../constants/ActionTypes';
import {getSuccessType} from '../../utils/actionTypes';

export default (state={}, action) => {
  switch (action.type) {
    case getSuccessType(ActionTypes.ACTIVITIES_FETCH):
      return action.data.activities;
    case getSuccessType(ActionTypes.USER_FETCH):
      const {activities} = action.data.user;
      return activities || state;
    default:
      return state;
  }
};
