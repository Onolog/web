import { getBaseType, getErrorType, getSuccessType, isBaseType } from '../actionTypes';

const TEST = 'TEST';
const TEST_ERROR = 'TEST_ERROR';
const TEST_SUCCESS = 'TEST_SUCCESS';

describe('actionType utils', () => {
  test('returns the base type from a given success or error type', () => {
    expect(getBaseType(TEST_ERROR)).toBe(TEST);
    expect(getBaseType(TEST_SUCCESS)).toBe(TEST);
    expect(getBaseType(TEST)).toBe(TEST);
  });

  test('returns the error type, given a base type', () => {
    expect(getErrorType(TEST)).toBe(TEST_ERROR);
  });

  test('returns the success type, given a base type', () => {
    expect(getSuccessType(TEST)).toBe(TEST_SUCCESS);
  });

  test('determines whether or not the type is a base type', () => {
    expect(isBaseType(TEST)).toBe(true);
    expect(isBaseType(TEST_ERROR)).toBe(false);
    expect(isBaseType(TEST_SUCCESS)).toBe(false);
  });
});
