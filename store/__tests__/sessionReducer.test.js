import sessionReducer from '../reducers/sessionReducer';
import { getSuccessType } from '../../utils/actionTypes';

import ActionTypes from '../../constants/ActionTypes';
import { SESSION, TEST_ACTION } from '../../constants/TestData';

describe('sessionReducer', () => {
  test('returns a default state', () => {
    expect(sessionReducer({}, TEST_ACTION)).toEqual({});
  });

  test('returns the state when initializing the session', () => {
    const action = {
      data: { session: SESSION },
      type: getSuccessType(ActionTypes.SESSION_INITIALIZE),
    };

    expect(sessionReducer({}, action)).toEqual(SESSION);
  });

  test('returns an updated session', () => {
    const updateUser = {
      firstName: 'Jimmy',
      id: 0,
    };

    const action = {
      data: { updateUser },
      type: getSuccessType(ActionTypes.USER_UPDATE),
    };

    expect(sessionReducer(SESSION, action)).toEqual({
      ...SESSION,
      user: {
        ...SESSION.user,
        ...updateUser,
      },
    });
  });
});
