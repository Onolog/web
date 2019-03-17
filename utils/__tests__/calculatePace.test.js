import { expect } from 'chai';

import calculatePace from '../calculatePace';

describe('calculatePace', () => {
  it('returns a valid pace', () => {
    const pace = calculatePace(5, 2100 /* 35 mins */);
    expect(pace).to.equal('7:00');
  });

  it('returns a valid pace when distance is a string', () => {
    const pace = calculatePace('5', 2100 /* 35 mins */);
    expect(pace).to.equal('7:00');
  });

  it('returns no pace when distance/seconds are not provided', () => {
    const pace = calculatePace();
    expect(pace).to.equal('0:00');
  });

  it('returns no pace when distance is a string zero', () => {
    const pace = calculatePace('0', 5);
    expect(pace).to.equal('0:00');
  });
});
