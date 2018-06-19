// @flow

/**
 * pad.js
 *
 * Util function for adding leading characters (usually zeroes) to a number or
 * string. Common use case: 3 -> '03'
 */
export default function(
  number: number,
  width?: number = 2,
  char?: string = '0'
): string {
  const num = number + '';
  return num.length >= width ?
    num :
    new Array(width - num.length + 1).join(char) + num;
}
