// @flow

/**
 * formatDistance.js
 *
 * Consistently formats distance measurements, by stripping trailing
 * zeroes and restricting floats to 2 decimal places.
 */
export default function formatDistance(distance: number | string): string {
  // Trim trailing zeroes and format by converting to a number and then
  // converting back to a localized number string.
  return (+distance).toLocaleString([], {
    maximumFractionDigits: 2,
  });
}
