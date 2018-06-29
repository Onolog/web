import {expect} from 'chai';

import param from '../param';

describe('param', () => {
  it('converts a param object to an uri encoded string', () => {
    const params = {
      foo: 'bar',
      baz: 1,
      email: 'me@example.com',
      sentence: 'This is a sentence',
      url: 'https://www.google.com',
    };
    // eslint-disable-next-line max-len
    expect(param(params)).to.equal('foo=bar&baz=1&email=me%40example.com&sentence=This%20is%20a%20sentence&url=https%3A%2F%2Fwww.google.com');
  });
});
