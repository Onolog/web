import PropTypes from 'prop-types';
import React from 'react';
import {Button, Modal} from 'react-bootstrap';

import ShoeView from './ShoeView.react';

/**
 * ShoeViewModal.react
 */
class ShoeViewModal extends React.Component {
  static displayName = 'ShoeViewModal';

  static propTypes = {
    onHide: PropTypes.func,
    shoe: PropTypes.object,
    show: PropTypes.bool,
  };

  render() {
    const {activities, shoe} = this.props;

    return (
      <Modal onHide={this._handleClose} show={this.props.show}>
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
          <Button onClick={this._handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  _handleClose = () => {
    this.props.onHide && this.props.onHide();
  };
}

module.exports = ShoeViewModal;
