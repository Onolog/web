// @flow

import {some} from 'lodash';

type Props = {
  pendingRequests: Object,
};

function requestCompleted(
  props: Props,
  nextProps: Props,
  types: string|Array<string>
) {
  if (typeof types === 'string') {
    types = [types];
  }

  return some(types, (type) => (
    props.pendingRequests[type] && !nextProps.pendingRequests[type]
  ));
}

export default requestCompleted;
