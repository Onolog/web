import {expect} from 'chai';

import {convertDistance, metersToMiles, metersToFeet, milesToKilometers} from '../distanceUtils';
import {UNITS} from '../../constants/metrics';

const KM_PER_MILE = 1.60935;

describe('distanceUtils', () => {
  it('converts meters to miles', () => {
    expect(metersToMiles(1609.35)).to.equal(1);
    expect(metersToMiles(5000)).to.equal(3.11);
    expect(metersToMiles(1617.3967499999997)).to.equal(1.01);
  });

  it('converts meters to feet', () => {
    expect(metersToFeet(100)).to.equal(328);
    expect(metersToFeet(5000)).to.equal(16404);
  });

  it('converts miles to kilometers', () => {
    expect(+milesToKilometers(1).toFixed(5)).to.equal(KM_PER_MILE);
  });

  it('conditionally converts miles to kilometers', () => {
    const kmPerMile = +convertDistance(1, UNITS.KILOMETERS).toFixed(5);
    expect(kmPerMile).to.equal(KM_PER_MILE);
    expect(convertDistance(1, UNITS.MILES)).to.equal(1);
  });
});
