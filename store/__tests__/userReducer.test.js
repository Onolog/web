import userReducer from '../reducers/userReducer';
import { getSuccessType } from '../../utils/actionTypes';

import ActionTypes from '../../constants/ActionTypes';
import { TEST_ACTION, USER } from '../../constants/TestData';

describe('userReducer', () => {
  test('returns a default state', () => {
    expect(userReducer({}, TEST_ACTION)).toEqual({});
  });

  test('returns the user object', () => {
    const action = {
      data: { user: USER },
      type: getSuccessType(ActionTypes.USER_FETCH),
    };

    expect(userReducer({}, action)).toEqual(USER);
  });

  test('returns an updated user object', () => {
    const updateUser = {
      firstName: 'Jimmy',
    };

    const action = {
      data: { updateUser },
      type: getSuccessType(ActionTypes.USER_UPDATE),
    };

    expect(userReducer(USER, action)).toEqual({
      ...USER,
      ...updateUser,
    });
  });
});
