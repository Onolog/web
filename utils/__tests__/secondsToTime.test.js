import secondsToTime from '../secondsToTime';

describe('secondsToTime', () => {
  test('converts seconds into a time format', () => {
    expect(secondsToTime(101596)).toBe('28:13:16');
    expect(secondsToTime(4113)).toBe('1:08:33');
    expect(secondsToTime(1921)).toBe('32:01');
    expect(secondsToTime(44)).toBe('0:44');
  });
});
