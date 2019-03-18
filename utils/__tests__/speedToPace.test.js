import speedToPace from '../speedToPace';

const SPEED = 2.6110000610351562;

describe('speedToPace', () => {
  test('converts meters/second to seconds/mile', () => {
    expect(speedToPace(SPEED)).toBe(616.3730227420821);
  });

  test('converts meters/second to seconds/km', () => {
    expect(speedToPace(SPEED, true)).toBe(382.9950121117731);
  });
});
