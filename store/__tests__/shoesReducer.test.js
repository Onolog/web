import shoesReducer from '../reducers/shoesReducer';
import { getSuccessType } from '../../utils/actionTypes';

import ActionTypes from '../../constants/ActionTypes';
import { SHOES, TEST_ACTION } from '../../constants/TestData';

const getShoeState = (nodes = []) => ({
  count: nodes.length,
  nodes,
});

describe('shoesReducer', () => {
  test('returns a default state', () => {
    expect(shoesReducer({}, TEST_ACTION)).toEqual({});
  });

  test('returns the state when fetching all shoes', () => {
    const shoes = getShoeState(SHOES);

    const action = {
      data: { shoes },
      type: getSuccessType(ActionTypes.SHOES_FETCH),
    };

    expect(shoesReducer(getShoeState(), action)).toEqual(shoes);
  });

  test('returns the state when fetching a single shoe', () => {
    const updatedShoe = { ...SHOES[1], notes: 'test' };
    const action = {
      data: { shoes: getShoeState([updatedShoe]) },
      type: getSuccessType(ActionTypes.SHOE_FETCH),
    };

    expect(shoesReducer(getShoeState([SHOES[0], SHOES[1]]), action))
      .toEqual(getShoeState([SHOES[0], updatedShoe]));
  });

  test('returns the state when creating a shoe', () => {
    const action = {
      data: { createShoe: SHOES[1] },
      type: getSuccessType(ActionTypes.SHOE_CREATE),
    };

    expect(shoesReducer(getShoeState([SHOES[0]]), action))
      .toEqual(getShoeState([SHOES[0], SHOES[1]]));
  });

  test('returns the state when deleting a shoe', () => {
    const action = {
      data: { deleteShoe: SHOES[0].id },
      type: getSuccessType(ActionTypes.SHOE_DELETE),
    };

    expect(shoesReducer(getShoeState([SHOES[0], SHOES[1]]), action))
      .toEqual(getShoeState([SHOES[1]]));
  });

  test('returns the state when updating a shoe', () => {
    const updatedShoe = { ...SHOES[1], notes: 'test' };
    const action = {
      data: { updateShoe: updatedShoe },
      type: getSuccessType(ActionTypes.SHOE_UPDATE),
    };

    expect(shoesReducer(getShoeState([SHOES[0], SHOES[1]]), action))
      .toEqual(getShoeState([SHOES[0], updatedShoe]));
  });
});
