import {expect} from 'chai';

import sessionReducer from '../reducers/sessionReducer';
import {getSuccessType} from '../../utils/actionTypes';

import ActionTypes from '../../constants/ActionTypes';
import {SESSION} from '../../constants/TestData';

describe('sessionReducer', () => {
  it('returns a default state', () => {
    expect(sessionReducer({}, {type: 'FOO'})).to.deep.equal({});
  });

  it('returns the state when initializing the session', () => {
    const action = {
      data: {session: SESSION},
      type: getSuccessType(ActionTypes.SESSION_INITIALIZE),
    };

    expect(sessionReducer({}, action)).to.deep.equal(SESSION);
  });

  it('returns an updated session', () => {
    const updateUser = {
      id: 0,
      firstName: 'Jimmy',
    };

    const action = {
      data: {updateUser},
      type: getSuccessType(ActionTypes.USER_UPDATE),
    };

    expect(sessionReducer(SESSION, action)).to.deep.equal({
      ...SESSION,
      user: {
        ...SESSION.user,
        ...updateUser,
      },
    });
  });
});
