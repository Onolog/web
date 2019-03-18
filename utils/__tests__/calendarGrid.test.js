import calendarGrid from '../calendarGrid';

describe('calendarGrid', () => {
  test('returns the correct data for the given month/year', () => {
    const calendarData = calendarGrid(0, 2017);

    // Number of full or partial weeks for January 2017.
    expect(calendarData.length).toBe(5);

    // Sunday, January 1, 2017
    const { date } = calendarData[0][0];
    expect(date.getDate()).toBe(1);
    expect(date.getDay()).toBe(0);
    expect(date.getFullYear()).toBe(2017);
  });

  test('throws an error when incorrect data is passed in', () => {
    const willThrow = () => calendarGrid('0', '2017');
    expect(willThrow).toThrowError(Error);
  });
});
