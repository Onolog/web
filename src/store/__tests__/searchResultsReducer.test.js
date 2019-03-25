import searchResultsReducer from '../reducers/searchResultsReducer';
import { getSuccessType } from '../../utils/actionTypes';
import ActionTypes from '../../constants/ActionTypes';
import { ACTIVITIES, TEST_ACTION } from '../../constants/TestData';

describe('searchResultsReducer', () => {
  test('returns a default state', () => {
    expect(searchResultsReducer([], TEST_ACTION)).toEqual([]);
  });

  test('returns the search results', () => {
    const nodes = ACTIVITIES.slice(0, 4);
    const action = {
      data: { activities: { nodes } },
      type: getSuccessType(ActionTypes.ACTIVITIES_SEARCH),
    };

    expect(searchResultsReducer([], action)).toEqual(nodes);
  });
});
