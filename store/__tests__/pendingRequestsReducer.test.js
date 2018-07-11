import {expect} from 'chai';

import pendingRequestsReducer from '../reducers/pendingRequestsReducer';
import {getSuccessType} from '../../utils/actionTypes';

import ActionTypes from '../../constants/ActionTypes';
import {TEST_ACTION} from '../../constants/TestData';

describe('pendingRequestsReducer', () => {
  it('returns a default state', () => {
    expect(pendingRequestsReducer({}, TEST_ACTION)).to.deep.equal({});
  });

  it('returns a pending state for a given action type', () => {
    const type = ActionTypes.BRANDS_FETCH;
    const state = pendingRequestsReducer({}, {type});

    expect(state[type]).to.equal(true);
  });

  it('returns a finished state for a given action type', () => {
    const type = ActionTypes.BRANDS_FETCH;
    const state = pendingRequestsReducer({}, {type: getSuccessType(type)});

    expect(state[type]).to.equal(false);
  });
});
