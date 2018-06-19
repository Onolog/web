export const getBaseType = (type) => (
  type.replace('_ERROR', '').replace('_SUCCESS', '')
);

export const getErrorType = (type) => `${type}_ERROR`;
export const getSuccessType = (type) => `${type}_SUCCESS`;

export const isBaseType = (type) => (
  type.indexOf('ERROR') === -1 && type.indexOf('SUCCESS') === -1
);
