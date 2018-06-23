import {expect} from 'chai';

import calendarGrid from 'utils/calendarGrid';

describe('calendarGrid', () => {
  it('returns the correct data for the given month/year', () => {
    const calendarData = calendarGrid(0, 2017);

    // Number of full or partial weeks for January 2017.
    expect(calendarData.length).to.equal(5);

    // Sunday, January 1, 2017
    const date = calendarData[0][0].date;
    expect(date.getDate()).to.equal(1);
    expect(date.getDay()).to.equal(0);
    expect(date.getFullYear()).to.equal(2017);
  });

  it('throws an error when incorrect data is passed in', () => {
    const willThrow = () => calendarGrid('0', '2017');
    expect(willThrow).to.throw(Error);
  });
});
