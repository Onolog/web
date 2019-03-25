import PropTypes from 'prop-types';
import { translate } from 'r-d3/lib/utils';
import React from 'react';

import './css/MouseIndicator.scss';

const MouseIndicator = ({ d, height, x, yFormat, y }) => {
  if (!d) {
    return null;
  }

  return (
    <g
      className="mouse-indicator"
      style={{ pointerEvents: 'none' }}>
      <path
        className="mouse-indicator-line"
        d={`M${x(d)},${height} ${x(d)},0`}
      />
      <g
        className="mouse-indicator-data"
        transform={translate(x(d), y(d))}>
        <circle r={4} />
        <text transform={translate(5, -5)}>
          {yFormat(d)}
        </text>
      </g>
    </g>
  );
};

MouseIndicator.propTypes = {
  d: PropTypes.object,
  height: PropTypes.number.isRequired,
  x: PropTypes.func.isRequired,
  y: PropTypes.func.isRequired,
  yFormat: PropTypes.func.isRequired,
};

export default MouseIndicator;
