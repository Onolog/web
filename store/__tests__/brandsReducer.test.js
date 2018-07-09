import {expect} from 'chai';

import brandsReducer from '../reducers/brandsReducer';
import {getSuccessType} from '../../utils/actionTypes';

import ActionTypes from '../../constants/ActionTypes';
import {BRANDS} from '../../constants/TestData';

describe('brandsReducer', () => {
  it('returns a default state', () => {
    expect(brandsReducer([], {type: 'FOO'})).to.deep.equal([]);
  });

  it('returns the correct state when fetching brands', () => {
    const action = {
      data: {brands: BRANDS},
      type: getSuccessType(ActionTypes.BRANDS_FETCH),
    };

    expect(brandsReducer([], action)).to.equal(BRANDS);
  });
});
