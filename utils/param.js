// @flow

/**
 * Serializes an object into a URI-encoded query string.
 */
export default function(obj: Object): string {
  return Object.keys(obj).map((key) => (
    `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`
  )).join('&');
}
