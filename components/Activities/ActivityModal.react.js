import React from 'react';
import {Button, ButtonToolbar, Modal} from 'react-bootstrap';

import ActivityForm from './ActivityForm.react';
import LeftRight from '../LeftRight/LeftRight.react';
import Loader from '../Loader/Loader.react';

import activityWriteContainer from '../../containers/activityWriteContainer';

/**
 * ActivityModal.react
 *
 * Edit an existing activity or create a new one.
 */
const ActivityModal = (props) => {
  const {
    activity,
    errors,
    isEditing,
    isLoading,
    onChange,
    onDelete,
    onExited,
    onHide,
    onSave,
    show,
  } = props;

  const deleteButton = isEditing ?
    <Button
      bsStyle="danger"
      onClick={onDelete}>
      Delete
    </Button> :
    null;

  return (
    <Modal onExited={onExited} onHide={onHide} show={show}>
      <Modal.Header closeButton>
        <Modal.Title>
          {`${isEditing ? 'Edit' : 'Create'} Activity`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoading && <Loader background full large />}
        <ActivityForm
          activity={activity}
          errors={errors}
          onChange={onChange}
        />
      </Modal.Body>
      <Modal.Footer>
        <LeftRight>
          {deleteButton}
          <ButtonToolbar>
            <Button
              disabled={isLoading}
              onClick={props.onHide}>
              Cancel
            </Button>
            <Button
              bsStyle="primary"
              disabled={isLoading}
              onClick={onSave}>
              {`${isEditing ? 'Update' : 'Create'} Activity`}
            </Button>
          </ButtonToolbar>
        </LeftRight>
      </Modal.Footer>
    </Modal>
  );
};

export default activityWriteContainer(ActivityModal);
