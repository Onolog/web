import pendingRequestsReducer from '../reducers/pendingRequestsReducer';
import { getSuccessType } from '../../utils/actionTypes';

import ActionTypes from '../../constants/ActionTypes';
import { TEST_ACTION } from '../../constants/TestData';

describe('pendingRequestsReducer', () => {
  test('returns a default state', () => {
    expect(pendingRequestsReducer({}, TEST_ACTION)).toEqual({});
  });

  test('returns a pending state for a given action type', () => {
    const type = ActionTypes.BRANDS_FETCH;
    const state = pendingRequestsReducer({}, { type });

    expect(state[type]).toBe(true);
  });

  test('returns a finished state for a given action type', () => {
    const type = ActionTypes.BRANDS_FETCH;
    const state = pendingRequestsReducer({}, { type: getSuccessType(type) });

    expect(state[type]).toBe(false);
  });
});
