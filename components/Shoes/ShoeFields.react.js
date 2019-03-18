import { range } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Checkbox, Col, FormControl, FormGroup } from 'react-bootstrap';

import AppForm from '../Forms/AppForm.react';
import BrandSelector from './BrandSelector.react';
import FormRow from '../Forms/FormGroup.react';

const FIELDS = {
  INACTIVE: 'inactive',
  SIZE: 'size',
};

const SIZE_TYPE = ['US', 'UK', 'Europe'];

const SIZES = {
  0: range(4, 16.5, 0.5).map((size) => ({ label: size, value: size })),
  1: range(2, 16, 0.5).map((size) => ({ label: size, value: size })),
  2: range(35, 50).map((size) => ({ label: size, value: size })),
};

/**
 * ShoeFields.react
 *
 * Displays a form with inputs for adding or editing a shoe.
 */
class ShoeFields extends React.Component {
  render() {
    const { brandId, model, notes, sizeType } = this.props.shoe;
    const size = parseFloat(this.props.shoe.size, 10);
    const shoeSizes = SIZES[sizeType || 0].slice();

    if (!size) {
      shoeSizes.unshift({ label: '--', value: -1 });
    }

    return (
      <AppForm bordered horizontal>
        <FormRow className="time" label="Brand">
          <BrandSelector
            name="brandId"
            onChange={this._handleChange}
            value={brandId}
          />
        </FormRow>
        <FormRow label="Model">
          <FormControl
            name="model"
            onChange={this._handleChange}
            type="text"
            value={model}
          />
        </FormRow>
        <FormRow inline label="Size">
          <FormControl
            componentClass="select"
            name="size_type"
            onChange={this._handleChange}
            value={sizeType}>
            {SIZE_TYPE.map((type, idx) => (
              /* eslint-disable react/no-array-index-key */
              <option key={idx} value={idx}>
                {type}
              </option>
            ))}
          </FormControl>
          {' '}
          <FormControl
            componentClass="select"
            name={FIELDS.SIZE}
            onChange={this._handleChange}
            value={size || ''}>
            {shoeSizes.map(({ label, value }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </FormControl>
        </FormRow>
        <FormRow label="Notes">
          <FormControl
            componentClass="textarea"
            name="notes"
            onChange={this._handleChange}
            placeholder="Add some notes about this shoe..."
            rows={3}
            value={notes || ''}
          />
        </FormRow>
        {this._renderInactiveCheckbox()}
      </AppForm>
    );
  }

  /**
   * Don't render this input when creating a new shoe, since we assume
   * that all newly created shoes are active.
   */
  _renderInactiveCheckbox = () => {
    const { isNew, shoe } = this.props;

    if (!isNew) {
      return (
        <FormGroup>
          <Col sm={9} smOffset={3}>
            <Checkbox
              checked={!!shoe.inactive}
              name={FIELDS.INACTIVE}
              onChange={this._handleChange}>
              Inactive
            </Checkbox>
          </Col>
        </FormGroup>
      );
    }
  };

  _handleChange = (e) => {
    const { checked, name, value } = e.target;
    const shoe = { ...this.props.shoe };

    switch (name) {
      case FIELDS.INACTIVE:
        shoe[name] = +checked;
        break;
      case FIELDS.SIZE:
        shoe[name] = value === '-1' ? null : value;
        break;
      default:
        shoe[name] = value;
        break;
    }

    this.props.onChange(shoe);
  };
}

ShoeFields.propTypes = {
  isNew: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  shoe: PropTypes.shape({
    brandId: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    model: PropTypes.string,
    notes: PropTypes.string,
    size: PropTypes.string,
    sizeType: PropTypes.number,
  }).isRequired,
};

export default ShoeFields;
