import PropTypes from 'prop-types';
import React from 'react';
import {Button, Modal} from 'react-bootstrap';

import Loader from '../Loader/Loader.react';
import ShoeFields from './ShoeFields.react';

/**
 * ShoeAddModal
 *
 * Modal for adding a new shoe.
 */
class ShoeAddModal extends React.Component {
  render() {
    const {isLoading, onChange, onSave, shoe, user, ...modalProps} = this.props;

    return (
      <Modal {...modalProps}>
        <Modal.Header closeButton>
          <Modal.Title>Add a New Shoe</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading && <Loader background full large />}
          <ShoeFields
            isNew
            onChange={onChange}
            shoe={shoe}
            user={user}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={isLoading}
            onClick={this.props.onHide}>
            Cancel
          </Button>
          <Button
            bsStyle="primary"
            disabled={isLoading}
            onClick={onSave}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

ShoeAddModal.displayName = 'ShoeAddModal';

ShoeAddModal.propTypes = {
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  shoe: PropTypes.object.isRequired,
  show: PropTypes.bool,
  user: PropTypes.object.isRequired,
};

export default ShoeAddModal;
