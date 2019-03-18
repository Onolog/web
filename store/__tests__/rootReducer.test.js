import rootReducer from '../reducers';

const history = { location: {} }; // Mock the `history` object.
const initialState = {};
const action = { type: 'FOO' };

describe('rootReducer', () => {
  // Basic test for overall app state.
  test('contains the expected subreducers', () => {
    const state = rootReducer(history)(initialState, action);

    expect(Object.keys(state)).toEqual([
      'activities',
      'brands',
      'garminActivity',
      'pendingRequests',
      'router',
      'searchResults',
      'session',
      'shoes',
      'ui',
      'user',
    ]);
  });
});
