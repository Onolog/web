import {expect} from 'chai';

import pad from '../pad';

describe('pad', () => {
  it('correctly adds leading characters to a number', () => {
    expect(pad(1)).to.equal('01');
    expect(pad(10)).to.equal('10');
  });
});
