import {expect} from 'chai';

import navigationReducer from '../reducers/navigationReducer';
import ActionTypes from '../../constants/ActionTypes';
import {TEST_ACTION} from '../../constants/TestData';

describe('navigationReducer', () => {
  it('returns a default state', () => {
    expect(navigationReducer({}, TEST_ACTION)).to.deep.equal({});
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
