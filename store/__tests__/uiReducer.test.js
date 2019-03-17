import { expect } from 'chai';

import uiReducer from '../reducers/uiReducer';
import ActionTypes from '../../constants/ActionTypes';
import { ACTIVITIES, TEST_ACTION } from '../../constants/TestData';

describe('uiReducer', () => {
  it('returns a default state', () => {
    expect(uiReducer({}, TEST_ACTION)).to.deep.equal({});
  });

  it('returns the side nav state', () => {
    const data = { sideNavOpen: true };

    const action = {
      data,
      type: ActionTypes.NAV_TOGGLE,
    };

    expect(uiReducer({}, action)).to.deep.equal(data);
  });

  it('opens the activity modal with some data', () => {
    const data = {
      initialActivity: ACTIVITIES[0],
    };

    const action = {
      data,
      type: ActionTypes.ACTIVITY_MODAL_SHOW,
    };

    expect(uiReducer({}, action)).to.deep.equal({
      activityModal: {
        ...data,
        show: true,
      },
    });
  });

  it('hides the activity modal', () => {
    const action = {
      type: ActionTypes.ACTIVITY_MODAL_HIDE,
    };

    expect(uiReducer({}, action)).to.deep.equal({
      activityModal: {
        show: false,
      },
    });
  });
});
