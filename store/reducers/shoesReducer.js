// @flow

import {getSuccessType} from '../../utils/actionTypes';
import ActionTypes from '../../constants/ActionTypes';

import type {Action} from '../../types/Action';

const shoeReducer = (state: Object={}, action: Action): Object => {
  let shoe;

  switch (action.type) {
    case getSuccessType(ActionTypes.SHOE_FETCH):
      const {shoes} = action.data;
      shoe = shoes && shoes.nodes && shoes.nodes[0];
      return state.id === shoe.id ? {...state, ...shoe} : state;
    case getSuccessType(ActionTypes.SHOE_UPDATE):
      shoe = action.data.updateShoe;
      return state.id === shoe.id ? {...state, ...shoe} : state;
    default:
      return state;
  }
};

export default (state: Object={}, action: Action): Object => {
  let nodes;

  switch (action.type) {
    case getSuccessType(ActionTypes.SHOES_FETCH):
      return action.data.shoes;
    case getSuccessType(ActionTypes.SHOE_CREATE):
      nodes = [
        ...state.nodes,
        action.data.createShoe,
      ];
      return {
        count: nodes.length,
        nodes,
      };
    case getSuccessType(ActionTypes.SHOE_UPDATE):
    case getSuccessType(ActionTypes.SHOE_FETCH):
      // TODO: This currently updates an existing shoe, but doesn't account for
      // fetching a shoe that isn't already part of the state.
      nodes = state.nodes.map((s) => shoeReducer(s, action));
      return {
        count: nodes.length,
        nodes,
      };
    case getSuccessType(ActionTypes.SHOE_DELETE):
      const shoeId = parseInt(action.data.deleteShoe, 10);
      nodes = state.nodes.filter((s) => s.id !== shoeId);
      return {
        count: nodes.length,
        nodes,
      };
    case getSuccessType(ActionTypes.USER_FETCH):
      const {shoes} = action.data.user;
      return shoes || state;
    default:
      return state;
  }
};
