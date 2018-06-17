// @flow

/**
 * pad.js
 *
 * Util function for adding leading characters (usually zeroes) to a number or
 * string. Common use case: 3 -> '03'
 */
export default function(number, width=2, char='0') {
  const num = number + '';
  return num.length >= width ?
    num :
    new Array(width - num.length + 1).join(char) + num;
}
