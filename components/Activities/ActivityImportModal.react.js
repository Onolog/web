import PropTypes from 'prop-types';
import React from 'react';
import {Button, ButtonToolbar, Modal} from 'react-bootstrap';

import ActivityFromUrlForm from './ActivityFromUrlForm.react';
import activityWriteContainer from '../../containers/activityWriteContainer';
import ActionTypes from '../../constants/ActionTypes';

class ActivityImportModal extends React.Component {
  render() {
    const {
      activity,
      isLoading,
      onChange,
      onExited,
      onHide,
      onSave,
      pendingRequests,
      show,
    } = this.props;

    // When the Garmin id is set, we have the activity data.
    const hasActivity = !!activity.garminActivityId;

    return (
      <Modal onExited={onExited} onHide={onHide} show={show}>
        <Modal.Header closeButton>
          <Modal.Title>Import an Activity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ActivityFromUrlForm
            activity={hasActivity ? activity : {}}
            isLoading={pendingRequests[ActionTypes.GARMIN_ACTIVITY_FETCH]}
            onChange={onChange}
          />
        </Modal.Body>
        <Modal.Footer>
          <ButtonToolbar className="pull-right">
            <Button
              disabled={isLoading}
              onClick={onHide}>
              Cancel
            </Button>
            <Button
              bsStyle="primary"
              disabled={isLoading || !hasActivity}
              onClick={onSave}>
              Create Activity
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

ActivityImportModal.propTypes = {
  activity: PropTypes.object,
};

export default activityWriteContainer(ActivityImportModal);
