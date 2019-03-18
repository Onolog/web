import getDistanceUnitString from '../getDistanceUnitString';
import { UNITS } from '../../constants/metrics';

describe('getDistanceUnitString', () => {
  test('returns the correct distance string', () => {
    expect(getDistanceUnitString(UNITS.MILES)).toBe('miles');
    expect(getDistanceUnitString(UNITS.KILOMETERS)).toBe('kilometers');
  });

  test('returns the correct abbreviated string', () => {
    expect(getDistanceUnitString(UNITS.MILES, true)).toBe('mi');
    expect(getDistanceUnitString(UNITS.KILOMETERS, true)).toBe('km');
  });

  test('throws an error when the correct unit type is not provided', () => {
    const willThrow = () => getDistanceUnitString(2);
    expect(willThrow).toThrowError(Error);
  });
});
