// @flow

import {BASE_IMG_URL} from '../constants/Garmin';

/**
 * Converts the full Garmin device name to an image URL
 */
export function getDeviceImageSrc(deviceName: string): string {
  // Convert from something like: 'Garmin Forerunner 910XT'
  // to: 'forerunner-910xt'
  var model = deviceName
    .toLowerCase()
    .replace('garmin ', '')
    .split(' ')
    .join('-');

  return BASE_IMG_URL + model + '.png';
}

/**
 * Returns the product page URL on Garmin.com for the given product.
 *
 * TODO: Get this working
 */
export function getDeviceProductPageURL(): string {
  // var info = this._getDeviceInfo();
  // if (!info) {
  //   return '';
  // }

  // var pID = PRODUCT_ID[info.series][info.model];
  // return `${BASE_STORE_URL}?${param({pID})}`;
  return '#';
}
