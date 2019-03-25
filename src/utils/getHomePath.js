// @flow

import moment from 'moment';

export default function getHomePath(): string {
  return moment().format('/YYYY/MM');
}
