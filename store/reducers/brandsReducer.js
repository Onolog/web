import ActionTypes from '../../constants/ActionTypes';
import {getSuccessType} from '../../utils/actionTypes';

export default(state=[], action) => {
  switch (action.type) {
    case getSuccessType(ActionTypes.BRANDS_FETCH):
      return action.data.brands;
    default:
      return state;
  }
};
