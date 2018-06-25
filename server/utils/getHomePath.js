import moment from 'moment';

export default function getHomePath() {
  return moment().format('/YYYY/MM');
}
