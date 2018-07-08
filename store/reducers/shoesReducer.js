import {getSuccessType} from '../../utils/actionTypes';
import ActionTypes from '../../constants/ActionTypes';

const shoe = (state={}, action) => {
  switch (action.type) {
    case getSuccessType(ActionTypes.SHOE_FETCH):
      const {shoes} = action.data;
      const shoe = shoes && shoes.nodes && shoes.nodes[0];
      return state.id === shoe.id ? {...state, ...shoe} : state;
    default:
      return state;
  }
};

export default (state={}, action) => {
  switch (action.type) {
    case getSuccessType(ActionTypes.SHOES_FETCH):
      return action.data.shoes;
    case getSuccessType(ActionTypes.SHOE_CREATE):
      const nodes = [
        ...state.nodes,
        ...action.data.createShoe.nodes,
      ];
      return {count: nodes.length, nodes};
    case getSuccessType(ActionTypes.SHOE_UPDATE):
    case getSuccessType(ActionTypes.SHOE_FETCH):
      // TODO: This currently updates an existing shoe, but doesn't account for
      // fetching a shoe that isn't already part of the state.
      return {
        ...state,
        nodes: state.nodes.map((s) => shoe(s, action)),
      };
    case getSuccessType(ActionTypes.USER_FETCH):
      const {shoes} = action.data.user;
      return shoes || state;
    default:
      return state;
  }
};
