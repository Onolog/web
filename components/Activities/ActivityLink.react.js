import {isEqual} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';

import ActivityModal from './ActivityModal.react';
import ActivityViewModal from './ActivityViewModal.react';
import Distance from '../Distance/Distance.react';
import Link from '../Link/Link.react';

/**
 * ActivityLink.react
 */
class ActivityLink extends React.Component {
  static propTypes = {
    activity: PropTypes.object.isRequired,
  };

  state = {
    isEditing: false,
    isLoading: false,
    showModal: false,
  };

  componentWillReceiveProps(nextProps) {
    // Close the modal if the activity was successfully updated.
    if (!isEqual(nextProps.activity, this.props.activity)) {
      this._hideModal();
    }
  }

  render() {
    const {activity} = this.props;
    const {isEditing, isLoading, showModal} = this.state;

    const modal = isEditing ?
      <ActivityModal
        animation={false}
        initialActivity={activity}
        onHide={this._hideModal}
        show={showModal}
      /> :
      <ActivityViewModal
        activity={activity}
        isLoading={isLoading}
        onEdit={this._handleEdit}
        onHide={this._hideModal}
        show={showModal}
      />;

    return (
      <Link className="workout" href="#" onClick={this._showModal}>
        <Distance
          abbreviate
          distance={activity.distance}
        />
        {modal}
      </Link>
    );
  }

  _handleEdit = () => {
    this.setState({isEditing: true});
  };

  _hideModal = (e) => {
    e && e.stopPropagation();

    this.setState({
      isEditing: false,
      isLoading: false,
      showModal: false,
    });
  };

  _showModal = () => {
    this.setState({showModal: true});
  };
}

export default ActivityLink;
