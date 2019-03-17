import { isEqual } from 'lodash';
import PropTypes from 'prop-types';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';

import ActivityModal from './ActivityModal.react';
import ActivityViewModal from './ActivityViewModal.react';
import Distance from '../Distance/Distance.react';
import LinkButton from '../LinkButton/LinkButton.react';

import { makeRequest } from '../../actions';
import requestCompleted from '../../utils/requestCompleted';

import ActionTypes from '../../constants/ActionTypes';

/**
 * ActivityLink.react
 */
class ActivityLink extends React.Component {
  state = {
    isEditing: false,
    showModal: false,
    wasFetched: false,
  };

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.activity, nextProps.activity)) {
      this.setState({ wasFetched: true });
    }

    if (requestCompleted(this.props, nextProps, ActionTypes.ACTIVITY_UPDATE)) {
      this._hideModal();
    }
  }

  render() {
    const { activity } = this.props;
    const { isEditing, showModal, wasFetched } = this.state;

    const modal = isEditing ?
      <ActivityModal
        animation={false}
        initialActivity={activity}
        onHide={this._hideModal}
        show={showModal}
      /> :
      <ActivityViewModal
        activity={activity}
        isLoading={!wasFetched}
        onEdit={this._handleEdit}
        onHide={this._hideModal}
        show={showModal}
      />;

    return (
      <Fragment>
        <LinkButton block className="workout" onClick={this._showModal}>
          <Distance abbreviate distance={activity.distance} />
        </LinkButton>
        {modal}
      </Fragment>
    );
  }

  _handleEdit = () => {
    this.setState({ isEditing: true });
  }

  _hideModal = (e) => {
    e && e.stopPropagation();

    this.setState({
      isEditing: false,
      showModal: false,
    });
  }

  _showModal = () => {
    this.setState({ showModal: true });

    const { activity, fetchActivity } = this.props;

    if (!this.state.wasFetched) {
      fetchActivity(activity.id);
    }
  }
}

ActivityLink.propTypes = {
  activity: PropTypes.object.isRequired,
};

const mapStateToProps = ({ pendingRequests }) => ({
  pendingRequests,
});

const mapDispatchToProps = (dispatch) => ({
  fetchActivity: (activityId) => dispatch(makeRequest(`
    query activities($activityId: ID) {
      activities(id: $activityId) {
        nodes {
          avgHr,
          calories,
          distance,
          duration,
          elevationGain,
          elevationLoss,
          friends,
          id,
          maxHr,
          notes,
          startDate,
          timezone,
          shoeId,
          shoe {
            id,
            name,
          }
          user {
            id,
            name,
          }
        }
      },
    }
  `, { activityId }, ActionTypes.ACTIVITY_FETCH)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ActivityLink);
