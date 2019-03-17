import { expect } from 'chai';
import moment from 'moment';

import getHomePath from '../getHomePath';

describe('getHomePath', () => {
  it('gets the string path for the logged-in home route', () => {
    expect(getHomePath()).to.equal(moment().format('/YYYY/MM'));
  });
});
