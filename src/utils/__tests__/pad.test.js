import pad from '../pad';

describe('pad', () => {
  test('correctly adds leading characters to a number', () => {
    expect(pad(1)).toBe('01');
    expect(pad(10)).toBe('10');
  });
});
