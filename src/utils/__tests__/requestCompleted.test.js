/*  eslint-disable no-multi-assign */

import requestCompleted from '../requestCompleted';

const TYPES = ['FOO', 'BAR'];

describe('requestCompleted', () => {
  let props, nextProps;

  beforeEach(() => {
    props = nextProps = {
      pendingRequests: {
        BAR: false,
        FOO: false,
      },
    };
  });

  test('indicates whether or not requests have been completed', () => {
    expect(requestCompleted(props, nextProps, TYPES)).toBe(false);

    props = {
      pendingRequests: {
        BAR: false,
        FOO: true,
      },
    };

    expect(requestCompleted(props, nextProps, TYPES)).toBe(true);
  });

  test('accepts a string value as the type', () => {
    props = {
      pendingRequests: {
        FOO: true,
      },
    };
    expect(requestCompleted(props, nextProps, 'FOO')).toBe(true);
  });
});
