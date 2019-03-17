import { expect } from 'chai';
import getParam from '../getParam';

describe('getParam', () => {
  it('returns a param from props', () => {
    const props = { match: { params: { foo: 'bar' } } };

    expect(getParam(props, 'foo')).to.equal('bar');
  });

  it('returns null if the requested param is not present', () => {
    const props = { match: { params: {} } };
    expect(getParam(props, 'foo')).to.equal(null);
  });

  it('is null-safe', () => {
    expect(getParam({}, 'foo')).to.equal(null);
  });
});
