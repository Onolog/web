import {expect} from 'chai';

import pad from 'utils/pad';

describe('pad', () => {
  it('correctly adds leading characters to a number', () => {
    expect(pad(1)).to.equal('01');
    expect(pad(1, 3, 'x')).to.equal('xx1');
  });
});
