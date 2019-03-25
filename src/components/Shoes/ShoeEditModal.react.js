import PropTypes from 'prop-types';
import React from 'react';
import { Button, ButtonToolbar, Modal } from 'react-bootstrap';

import LeftRight from '../LeftRight/LeftRight.react';
import Loader from '../Loader/Loader.react';
import ShoeFields from './ShoeFields.react';

/**
 * ShoeEditModal
 *
 * Modal for editing an existing shoe.
 */
const ShoeEditModal = (props) => {
  const {
    initialShoe,
    isLoading,
    onChange,
    onDelete,
    onSave,
    shoe,
    user,
    ...modalProps
  } = props;

  return (
    <Modal {...modalProps}>
      <Modal.Header closeButton>
        <Modal.Title>{initialShoe.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Loader background full large />}
        <ShoeFields
          onChange={onChange}
          shoe={shoe}
          user={user}
        />
      </Modal.Body>
      <Modal.Footer>
        <LeftRight>
          <Button
            bsStyle="danger"
            onClick={onDelete}>
            Delete
          </Button>
          <ButtonToolbar>
            <Button
              disabled={isLoading}
              onClick={modalProps.onHide}>
              Cancel
            </Button>
            <Button
              bsStyle="primary"
              disabled={isLoading}
              onClick={onSave}>
              Update
            </Button>
          </ButtonToolbar>
        </LeftRight>
      </Modal.Footer>
    </Modal>
  );
};

ShoeEditModal.propTypes = {
  isLoading: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onHide: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  shoe: PropTypes.object.isRequired,
  show: PropTypes.bool,
  user: PropTypes.object.isRequired,
};

export default ShoeEditModal;
