import { convertDistance, metersToMiles, metersToFeet, milesToKilometers } from '../distanceUtils';
import { UNITS } from '../../constants/metrics';

const KM_PER_MILE = 1.60935;

describe('distanceUtils', () => {
  test('converts meters to miles', () => {
    expect(metersToMiles(1609.35)).toBe(1);
    expect(metersToMiles(5000)).toBe(3.11);
    expect(metersToMiles(1617.3967499999997)).toBe(1.01);
  });

  test('converts meters to feet', () => {
    expect(metersToFeet(100)).toBe(328);
    expect(metersToFeet(5000)).toBe(16404);
  });

  test('converts miles to kilometers', () => {
    expect(+milesToKilometers(1).toFixed(5)).toBe(KM_PER_MILE);
  });

  test('conditionally converts miles to kilometers', () => {
    const kmPerMile = +convertDistance(1, UNITS.KILOMETERS).toFixed(5);
    expect(kmPerMile).toBe(KM_PER_MILE);
    expect(convertDistance(1, UNITS.MILES)).toBe(1);
  });
});
