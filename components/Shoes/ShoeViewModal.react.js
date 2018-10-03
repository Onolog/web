import PropTypes from 'prop-types';
import React from 'react';
import {Button, Modal} from 'react-bootstrap';

import ShoeView from './ShoeView.react';

/**
 * ShoeViewModal.react
 */
const ShoeViewModal = ({activities, onHide, shoe, show}) => {
  return (
    <Modal onHide={onHide} show={show}>
      <Modal.Header closeButton>
        <Modal.Title>{shoe.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ShoeView
          activities={activities}
          isLoading={shoe.activity_count !== activities.length}
          shoe={shoe}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

ShoeViewModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  shoe: PropTypes.object,
  show: PropTypes.bool,
};

export default ShoeViewModal;
