import { expect } from 'chai';

import getDistanceUnitString from '../getDistanceUnitString';
import { UNITS } from '../../constants/metrics';

describe('getDistanceUnitString', () => {
  it('returns the correct distance string', () => {
    expect(getDistanceUnitString(UNITS.MILES)).to.equal('miles');
    expect(getDistanceUnitString(UNITS.KILOMETERS)).to.equal('kilometers');
  });

  it('returns the correct abbreviated string', () => {
    expect(getDistanceUnitString(UNITS.MILES, true)).to.equal('mi');
    expect(getDistanceUnitString(UNITS.KILOMETERS, true)).to.equal('km');
  });

  it('throws an error when the correct unit type is not provided', () => {
    const willThrow = () => getDistanceUnitString(2);
    expect(willThrow).to.throw(Error);
  });
});
