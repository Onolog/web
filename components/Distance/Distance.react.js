import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { convertDistance } from '../../utils/distanceUtils';
import formatDistance from '../../utils/formatDistance';
import getDistanceUnitString from '../../utils/getDistanceUnitString';

import { UNITS } from '../../constants/metrics';

import './Distance.scss';

const mapStateToProps = ({ session: { user } }) => {
  return {
    units: user ? user.distanceUnits : UNITS.MILES,
  };
};

const DistanceLabel = (props) => {
  const { abbreviate, units } = props;
  return (
    <span className="distance-label">
      {getDistanceUnitString(units, abbreviate)}
    </span>
  );
};

DistanceLabel.propTypes = {
  abbreviate: PropTypes.bool,
  units: PropTypes.oneOf([
    UNITS.KILOMETERS,
    UNITS.MILES,
  ]).isRequired,
};

DistanceLabel.defaultProps = {
  abbreviate: false,
};

const Distance = (props) => {
  const { distance, label, units, ...labelProps } = props;
  return (
    <span className="distance">
      {formatDistance(convertDistance(distance, units))}
      {label && ' '}
      {label && <DistanceLabel {...labelProps} units={units} />}
    </span>
  );
};

Distance.propTypes = {
  distance: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]).isRequired,
  label: PropTypes.bool,
  units: PropTypes.oneOf([
    UNITS.KILOMETERS,
    UNITS.MILES,
  ]).isRequired,
};

Distance.defaultProps = {
  label: true,
};

Distance.Label = connect(mapStateToProps)(DistanceLabel);

export default connect(mapStateToProps)(Distance);
