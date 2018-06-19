import {isEmpty} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Select from '../Select/Select.react';
import {makeRequest} from '../../actions';

import {convertDistance} from '../../utils/distanceUtils';
import formatDistance from '../../utils/formatDistance';
import getDistanceUnitString from '../../utils/getDistanceUnitString';

import {UNITS} from '../../constants/metrics';

/**
 * ShoeSelector.react
 *
 * HTML selector that displays all of a user's shoes, grouped by activity state.
 */
class ShoeSelector extends React.Component {
  state = {
    // TODO: This is kind of a hack.
    initialSelection: this.props.defaultValue,
  };

  componentWillMount() {
    if (isEmpty(this.props.shoes)) {
      this.props.fetchData(this.props.session.user.id);
    }
  }

  render() {
    const {fetchData, shoes, value, ...props} = this.props;

    return (
      <Select
        {...props}
        defaultLabel="Select a shoe:"
        options={this._getOptions(shoes.nodes || [])}
        value={value || ''}
      />
    );
  }

  /**
   * Group the list of shoes by active or inactive, and format the data
   * correctly.
   */
  _getOptions = (shoes) => {
    // Filter out inactive shoes unless it's the initially selected shoe.
    shoes = shoes.filter((shoe) => (
      !shoe.inactive || shoe.id === +this.state.initialSelection
    ));

    let options = [];
    if (shoes && shoes.length) {
      const {units} = this.props;

      shoes.forEach((shoe) => {
        const distance = formatDistance(convertDistance(shoe.mileage, units));
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
  defaultValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  units: PropTypes.oneOf([
    UNITS.KILOMETERS,
    UNITS.MILES,
  ]).isRequired,
  shoes: PropTypes.shape({
    nodes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.isRequired,
    })),
  }),
};

const mapStoreToProps = ({session, shoes}) => {
  return {
    session,
    shoes,
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
        }
      }
    }
  `, {userId}, 'SHOES_FETCH')),
});

export default connect(mapStoreToProps, mapDispatchToProps)(ShoeSelector);
