import {expect} from 'chai';

import formatDistance from '../formatDistance';

describe('formatDistance', () => {
  it('correctly formats distances', () => {
    expect(formatDistance(1.00)).to.equal('1');
    expect(formatDistance(1.3333)).to.equal('1.33');
    expect(formatDistance('1.50')).to.equal('1.5');
    expect(formatDistance(1000)).to.equal('1,000');
  });
});
