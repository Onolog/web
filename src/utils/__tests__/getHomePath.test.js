import moment from 'moment';

import getHomePath from '../getHomePath';

describe('getHomePath', () => {
  test('gets the string path for the logged-in home route', () => {
    expect(getHomePath()).toBe(moment().format('/YYYY/MM'));
  });
});
