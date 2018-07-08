import {expect} from 'chai';

import shoesReducer from '../reducers/shoesReducer';
import {getSuccessType} from '../../utils/actionTypes';
import ActionTypes from '../../constants/ActionTypes';

const SHOE_1 = {
  id: 0,
  name: 'Test One',
};

const SHOE_2 = {
  id: 1,
  name: 'Test Two',
};

const getShoeState = (nodes=[]) => ({
  count: nodes.length,
  nodes,
});

describe('shoesReducer', () => {
  it('returns the correct state when fetching shoes', () => {
    const shoes = getShoeState([SHOE_1, SHOE_2]);

    const action = {
      data: {shoes},
      type: getSuccessType(ActionTypes.SHOES_FETCH),
    };

    expect(shoesReducer(getShoeState(), action)).to.deep.equal(shoes);
  });

  it('returns the correct state when creating a shoe', () => {
    const action = {
      data: {createShoe: getShoeState([SHOE_2])},
      type: getSuccessType(ActionTypes.SHOE_CREATE),
    };

    expect(shoesReducer(getShoeState([SHOE_1]), action))
      .to.deep.equal(getShoeState([SHOE_1, SHOE_2]));
  });

  it('returns the correct state when fetching a single shoe', () => {
    const updatedShoe = {...SHOE_2, notes: 'test'};
    const action = {
      data: {shoes: getShoeState([updatedShoe])},
      type: getSuccessType(ActionTypes.SHOE_FETCH),
    };

    expect(shoesReducer(getShoeState([SHOE_1, SHOE_2]), action))
      .to.deep.equal(getShoeState([SHOE_1, updatedShoe]));
  });
});
