import { expect } from 'chai';

import userReducer from '../reducers/userReducer';
import { getSuccessType } from '../../utils/actionTypes';

import ActionTypes from '../../constants/ActionTypes';
import { TEST_ACTION, USER } from '../../constants/TestData';

describe('userReducer', () => {
  it('returns a default state', () => {
    expect(userReducer({}, TEST_ACTION)).to.deep.equal({});
  });

  it('returns the user object', () => {
    const action = {
      data: { user: USER },
      type: getSuccessType(ActionTypes.USER_FETCH),
    };

    expect(userReducer({}, action)).to.deep.equal(USER);
  });

  it('returns an updated user object', () => {
    const updateUser = {
      firstName: 'Jimmy',
    };

    const action = {
      data: { updateUser },
      type: getSuccessType(ActionTypes.USER_UPDATE),
    };

    expect(userReducer(USER, action)).to.deep.equal({
      ...USER,
      ...updateUser,
    });
  });
});
