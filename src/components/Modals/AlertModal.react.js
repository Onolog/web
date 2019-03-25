import PropTypes from 'prop-types';
import React from 'react';
import { Alert, Modal } from 'react-bootstrap';

import './css/AlertModal.scss';

const AUTOHIDE_INTERVAL = 10 * 1000; // 10 seconds

const AlertModal = ({ autohideInterval, bsStyle, children, onHide, show }) => (
  <Modal
    backdrop={false}
    bsSize="small"
    dialogClassName="alert-modal"
    onEntered={() => setInterval(onHide, autohideInterval)}
    onHide={onHide}
    show={show}>
    <Alert bsStyle={bsStyle} onDismiss={onHide}>
      {children}
    </Alert>
  </Modal>
);

AlertModal.propTypes = {
  autohideInterval: PropTypes.number,
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool,
};

AlertModal.defaultProps = {
  autohideInterval: AUTOHIDE_INTERVAL,
  show: false,
};

export default AlertModal;
