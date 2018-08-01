// @flow

export const getBaseType = (type: string): string => (
  type.replace('_ERROR', '').replace('_SUCCESS', '')
);

export const getErrorType = (type: string): string => `${type}_ERROR`;
export const getSuccessType = (type: string): string => `${type}_SUCCESS`;

export const isBaseType = (type: string): bool => (
  type.indexOf('ERROR') === -1 && type.indexOf('SUCCESS') === -1
);
