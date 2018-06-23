import {expect} from 'chai';

import secondsToTime from 'utils/secondsToTime';

describe('secondsToTime', () => {
  it('converts seconds into a time format', () => {
    expect(secondsToTime(101596)).to.equal('28:13:16');
    expect(secondsToTime(4113)).to.equal('1:08:33');
    expect(secondsToTime(1921)).to.equal('32:01');
    expect(secondsToTime(44)).to.equal('0:44');
  });
});
