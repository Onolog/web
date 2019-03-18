import getParam from '../getParam';

describe('getParam', () => {
  test('returns a param from props', () => {
    const props = { match: { params: { foo: 'bar' } } };

    expect(getParam(props, 'foo')).toBe('bar');
  });

  test('returns null if the requested param is not present', () => {
    const props = { match: { params: {} } };
    expect(getParam(props, 'foo')).toBeNull();
  });

  test('is null-safe', () => {
    expect(getParam({}, 'foo')).toBeNull();
  });
});
