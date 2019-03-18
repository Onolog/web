import rootReducer from '../reducers';

describe('rootReducer', () => {
  // Basic test for overall app state.
  test('contains the expected subreducers', () => {
    const state = rootReducer({}, { type: 'FOO' });

    expect(Object.keys(state)).toEqual([
      'activities',
      'brands',
      'garminActivity',
      'pendingRequests',
      'searchResults',
      'session',
      'shoes',
      'ui',
      'user',
    ]);
  });
});
