import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import Select from '../Select/Select.react';

import {makeRequest} from '../../actions/';
import ActionTypes from '../../constants/ActionTypes';

/**
 * BrandSelector.react
 *
 * A selector element that displays all possible shoe brands.
 */
class BrandSelector extends React.Component {
  componentDidMount() {
    if (!this.props.brands.length) {
      this.props.fetchBrands();
    }
  }

  render() {
    const {brands, fetchBrands, ...otherProps} = this.props;
    const options = [];

    brands.forEach((brand) => {
      options.push({
        label: brand.name,
        value: brand.id,
      });
    });

    return (
      <Select
        {...otherProps}
        defaultLabel="Select a brand:"
        disabled={!options.length}
        options={options}
      />
    );
  }
}

BrandSelector.propTypes = {
  brands: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
};

const mapStateToProps = ({brands}) => ({
  brands,
});

const mapDispatchToProps = (dispatch) => ({
  fetchBrands: () => dispatch(makeRequest(`
    query brands {
      brands {
        id,
        name,
      }
    }
  `, {}, ActionTypes.BRANDS_FETCH)),
});

export default connect(mapStateToProps, mapDispatchToProps)(BrandSelector);
