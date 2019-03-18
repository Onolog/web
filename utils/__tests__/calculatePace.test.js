import calculatePace from '../calculatePace';

describe('calculatePace', () => {
  test('returns a valid pace', () => {
    const pace = calculatePace(5, 2100 /* 35 mins */);
    expect(pace).toBe('7:00');
  });

  test('returns a valid pace when distance is a string', () => {
    const pace = calculatePace('5', 2100 /* 35 mins */);
    expect(pace).toBe('7:00');
  });

  test('returns no pace when distance/seconds are not provided', () => {
    const pace = calculatePace();
    expect(pace).toBe('0:00');
  });

  test('returns no pace when distance is a string zero', () => {
    const pace = calculatePace('0', 5);
    expect(pace).toBe('0:00');
  });
});
