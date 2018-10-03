import {isEqual, pick} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import ShoeAddModal from './ShoeAddModal.react';
import ShoeEditModal from './ShoeEditModal.react';

import {makeRequest} from '../../actions';
import ActionTypes from '../../constants/ActionTypes';

const DEFAULT_SHOE = {
  brandId: '-1',
  inactive: 0,
  model: '',
  notes: '',
  size: '',
  sizeType: 0,
};

const getInitialState = ({initialShoe}) => ({
  isLoading: false,
  shoe: initialShoe || DEFAULT_SHOE,
});

/**
 * ShoeModal.react
 *
 * Modal for adding or editing the properties of a single shoe.
 */
class ShoeModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = getInitialState(props);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.initialShoe, nextProps.initialShoe)) {
      this.setState(getInitialState(nextProps));
    }
  }

  render() {
    const {initialShoe, show, user} = this.props;
    const {isLoading, shoe} = this.state;

    // Common props.
    const props = {
      isLoading,
      onChange: this._handleChange,
      onExited: this._handleExited,
      onHide: this._handleClose,
      onSave: this._handleSave,
      shoe,
      show,
      user,
    };

    return initialShoe ?
      <ShoeEditModal
        {...props}
        initialShoe={initialShoe}
        onDelete={() => this._handleDelete(shoe.id)}
      /> :
      <ShoeAddModal
        {...props}
      />;
  }

  _handleChange = (shoe) => {
    this.setState({shoe});
  };

  _handleClose = () => {
    const {shoe} = getInitialState(this.props);
    const hasChanges = !isEqual(shoe, this.state.shoe);
    const confirmed = hasChanges && confirm(
      'Are you sure you want to close the dialog? Your changes will not ' +
      'be saved'
    );

    if (!hasChanges || confirmed) {
      this.props.onHide && this.props.onHide();
    }
  };

  _handleDelete = (id, e) => {
    if (confirm('Are you sure you want to delete this shoe?')) {
      this.props.deleteShoe(id);
    }
  };

  /**
   * Reset the form when the modal closes.
   */
  _handleExited = (e) => {
    this.setState(getInitialState(this.props));
  };

  _handleSave = (e) => {
    const {createShoe, initialShoe, updateShoe, user} = this.props;
    const {shoe} = this.state;

    if (parseInt(shoe.brandId, 10) === -1) {
      alert('Please select a brand.');
      return;
    }

    if (!shoe.model) {
      alert('Please enter a model name.');
      return;
    }

    this.setState({isLoading: true});

    const shoeInput = {
      ...pick(shoe, Object.keys(DEFAULT_SHOE)),
      userId: user.id,
    };

    if (initialShoe) {
      updateShoe(initialShoe.id, shoeInput);
    } else {
      createShoe(shoeInput);
    }
  };
}

ShoeModal.propTypes = {
  initialShoe: PropTypes.object,
  onHide: PropTypes.func,
  show: PropTypes.bool,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = ({session}) => ({
  user: session.user,
});

const shoeFields = `
  id,
  inactive,
  model,
  name,
  size,
  activities {
    count,
    sumDistance,
  }
`;

const mapDispatchToProps = (dispatch) => ({
  createShoe: (input) => dispatch(makeRequest(`
    mutation createShoe($input: ShoeInput!) {
      createShoe(input: $input) {
        ${shoeFields}
      }
    }
  `, {input}, ActionTypes.SHOE_CREATE)),
  deleteShoe: (id) => dispatch(makeRequest(`
    mutation deleteShoe($id: ID!) {
      deleteShoe(id: $id)
    }
  `, {id}, ActionTypes.SHOE_DELETE)),
  updateShoe: (id, input) => dispatch(makeRequest(`
    mutation updateShoe($id: ID!, $input: ShoeInput!) {
      updateShoe(id: $id, input: $input) {
        ${shoeFields}
      }
    }
  `, {id, input}, ActionTypes.SHOE_UPDATE)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoeModal);
