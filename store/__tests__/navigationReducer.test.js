import {expect} from 'chai';

import navigationReducer from '../reducers/navigationReducer';
import ActionTypes from '../../constants/ActionTypes';

describe('navigationReducer', () => {
  it('returns a default state', () => {
    expect(navigationReducer({}, {type: 'FOO'})).to.deep.equal({});
  });

  it('returns the side nav state', () => {
    const data = {sideNavOpen: true};

    const action = {
      data,
      type: ActionTypes.NAV_TOGGLE,
    };

    expect(navigationReducer({}, action)).to.deep.equal(data);
  });
});
