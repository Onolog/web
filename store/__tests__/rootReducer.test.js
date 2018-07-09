import {expect} from 'chai';

import rootReducer from '../reducers/';

describe('rootReducer', () => {
  // Basic test for overall app state.
  it('contains the expected subreducers', () => {
    const state = rootReducer({}, {type: 'FOO'});

    expect(Object.keys(state)).to.deep.equal([
      'activities',
      'brands',
      'garminActivity',
      'navigation',
      'pendingRequests',
      'session',
      'shoes',
      'user',
    ]);
  });
});
