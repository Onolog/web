import {expect} from 'chai';

import {getBaseType, getErrorType, getSuccessType, isBaseType} from '../actionTypes';

const TEST = 'TEST';
const TEST_ERROR = 'TEST_ERROR';
const TEST_SUCCESS = 'TEST_SUCCESS';

describe('actionType utils', () => {
  it('returns the base type from a given success or error type', () => {
    expect(getBaseType(TEST_ERROR)).to.equal(TEST);
    expect(getBaseType(TEST_SUCCESS)).to.equal(TEST);
    expect(getBaseType(TEST)).to.equal(TEST);
  });

  it('returns the error type, given a base type', () => {
    expect(getErrorType(TEST)).to.equal(TEST_ERROR);
  });

  it('returns the success type, given a base type', () => {
    expect(getSuccessType(TEST)).to.equal(TEST_SUCCESS);
  });

  it('determines whether or not the type is a base type', () => {
    expect(isBaseType(TEST)).to.equal(true);
    expect(isBaseType(TEST_ERROR)).to.equal(false);
    expect(isBaseType(TEST_SUCCESS)).to.equal(false);
  });
});
