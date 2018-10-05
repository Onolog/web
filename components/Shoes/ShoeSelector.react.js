import {isEmpty} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {FormControl} from 'react-bootstrap';
import {connect} from 'react-redux';


import {makeRequest} from '../../actions';
import {convertDistance} from '../../utils/distanceUtils';
import formatDistance from '../../utils/formatDistance';
import getDistanceUnitString from '../../utils/getDistanceUnitString';

import ActionTypes from '../../constants/ActionTypes';
import {UNITS} from '../../constants/metrics';

/**
 * ShoeSelector.react
 *
 * HTML selector that displays all of a user's shoes, grouped by activity state.
 */
class ShoeSelector extends React.Component {
  componentDidMount() {
    if (isEmpty(this.props.shoes)) {
      this.props.fetchData(this.props.session.user.id);
    }
  }

  render() {
    const {fetchData, shoes, ...props} = this.props;

    return (
      <FormControl {...props} componentClass="select">
        {this._getOptions(shoes || []).map(({label, value}) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </FormControl>
    );
  }

  /**
   * Group the list of shoes by active or inactive, and format the data
   * correctly.
   */
  _getOptions = (shoes) => {
    // Filter out inactive shoes unless it's the initially selected shoe.
    shoes = shoes.filter((shoe) => (
      shoe.id === this.props.defaultValue ||
      shoe.id === this.props.value ||
      !shoe.inactive
    ));

    let options = [
      {label: 'Select a shoe...', value: -1},
    ];

    if (shoes && shoes.length) {
      const {units} = this.props;

      shoes.forEach((shoe) => {
        const {sumDistance} = shoe.activities;
        const distance = formatDistance(convertDistance(sumDistance, units));
        const distanceLabel = getDistanceUnitString(units, true);

        options.push({
          label: `${shoe.name} (${distance} ${distanceLabel})`,
          value: shoe.id,
        });
      });
    }

    return options;
  }
}

ShoeSelector.propTypes = {
  shoes: PropTypes.arrayOf(PropTypes.shape({
    activities: PropTypes.shape({
      sumDistance: PropTypes.number,
    }),
    id: PropTypes.number.isRequired,
    inactive: PropTypes.bool.isRequired,
    name: PropTypes.isRequired,
  })),
  units: PropTypes.oneOf([
    UNITS.KILOMETERS,
    UNITS.MILES,
  ]).isRequired,
};

const mapStoreToProps = ({session, shoes}) => {
  return {
    session,
    shoes: (shoes && shoes.nodes) || [],
    units: (session && session.user.distanceUnits) || UNITS.MILES,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchData: (userId) => dispatch(makeRequest(`
    query shoes($userId: ID) {
      shoes(userId: $userId) {
        nodes {
          name,
          id,
          inactive,
          activities {
            sumDistance
          }
        }
      }
    }
  `, {userId}, ActionTypes.SHOES_FETCH)),
});

export default connect(mapStoreToProps, mapDispatchToProps)(ShoeSelector);
