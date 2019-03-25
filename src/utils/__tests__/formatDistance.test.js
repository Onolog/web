import formatDistance from '../formatDistance';

describe('formatDistance', () => {
  test('correctly formats distances', () => {
    expect(formatDistance(1.00)).toBe('1');
    expect(formatDistance(1.3333)).toBe('1.33');
    expect(formatDistance('1.50')).toBe('1.5');
    expect(formatDistance(1000)).toBe('1,000');
  });
});
