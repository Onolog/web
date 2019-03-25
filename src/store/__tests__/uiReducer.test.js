import uiReducer from '../reducers/uiReducer';
import ActionTypes from '../../constants/ActionTypes';
import { ACTIVITIES, TEST_ACTION } from '../../constants/TestData';

describe('uiReducer', () => {
  test('returns a default state', () => {
    expect(uiReducer({}, TEST_ACTION)).toEqual({});
  });

  test('returns the side nav state', () => {
    const data = { sideNavOpen: true };

    const action = {
      data,
      type: ActionTypes.NAV_TOGGLE,
    };

    expect(uiReducer({}, action)).toEqual(data);
  });

  test('opens the activity modal with some data', () => {
    const data = {
      initialActivity: ACTIVITIES[0],
    };

    const action = {
      data,
      type: ActionTypes.ACTIVITY_MODAL_SHOW,
    };

    expect(uiReducer({}, action)).toEqual({
      activityModal: {
        ...data,
        show: true,
      },
    });
  });

  test('hides the activity modal', () => {
    const action = {
      type: ActionTypes.ACTIVITY_MODAL_HIDE,
    };

    expect(uiReducer({}, action)).toEqual({
      activityModal: {
        show: false,
      },
    });
  });
});
