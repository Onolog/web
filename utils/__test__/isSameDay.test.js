import {expect} from 'chai';

import isSameDay from 'utils/isSameDay';

describe('isSameDay', () => {
  it('checks if two dates are the same day', () => {
    const date1 = new Date();
    const date2 = new Date();
    const date3 = new Date(277801200000); // 10/21/78

    expect(isSameDay(date1, date2)).to.be.true;
    expect(isSameDay(date1, date3)).to.be.false;
  });
});
