import { expect } from 'chai';

import speedToPace from '../speedToPace';

const SPEED = 2.6110000610351562;

describe('speedToPace', () => {
  it('converts meters/second to seconds/mile', () => {
    expect(speedToPace(SPEED)).to.equal(616.3730227420821);
  });

  it('converts meters/second to seconds/km', () => {
    expect(speedToPace(SPEED, true)).to.equal(382.9950121117731);
  });
});
