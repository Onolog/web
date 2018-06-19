import {find} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Button, ButtonGroup, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';

import AppFullPage from '../../components/Page/AppFullPage.react';
import Loader from '../../components/Loader/Loader.react';
import MaterialIcon from '../../components/Icons/MaterialIcon.react';
import PageFrame from '../../components/Page/PageFrame.react';
import PageHeader from '../../components/Page/PageHeader.react';
import ShoeModal from '../../components/Shoes/ShoeModal.react';
import ShoeView from '../../components/Shoes/ShoeView.react';

import {deleteShoe, viewShoe} from 'actions/shoes';
import {SHOE_DELETE, SHOE_UPDATE, SHOE_VIEW} from 'constants/ActionTypes';

import '../../components/Shoes/css/Shoe.scss';

function getIntParam(params, name) {
  return parseInt(params[name], 10);
}

const mapStoreToProps = (state, props) => {
  const {activities, pendingRequests, session, shoes} = state;
  return {
    activities,
    pendingRequests,
    shoe: find(shoes, {id: getIntParam(props.params, 'shoeId')}),
    viewer: session,
  };
};

/**
 * ShoeController.react
 *
 * Displays the view for a single shoe.
 */
class ShoeController extends React.Component {
  static propTypes = {
    activities: PropTypes.arrayOf(PropTypes.object.isRequired),
    shoe: PropTypes.shape({
      activities: PropTypes.array.isRequired,
      id: PropTypes.number.isRequired,
      mileage: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      userId: PropTypes.number.isRequired,
    }),
    pendingRequests: PropTypes.object.isRequired,
    viewer: PropTypes.shape({
      id: PropTypes.number.isRequired,
    }),
  };

  state = {
    showModal: false,
  };

  componentWillMount() {
    const {dispatch, params} = this.props;
    dispatch(viewShoe(getIntParam(params, 'shoeId')));
  }

  componentWillReceiveProps(nextProps) {
    const {pendingRequests} = this.props;

    if (
      pendingRequests[SHOE_UPDATE] &&
      !nextProps.pendingRequests[SHOE_UPDATE]
    ) {
      this.setState({showModal: false});
    }

    // Redirect if the activity was deleted.
    if (pendingRequests[SHOE_DELETE] && !nextProps.shoe) {
      browserHistory.push('/shoes');
      return;
    }
  }

  render() {
    const {activities, pendingRequests, shoe} = this.props;

    if (!shoe || pendingRequests[SHOE_VIEW]) {
      return (
        <AppFullPage>
          <Loader background full />;
        </AppFullPage>
      );
    }

    return (
      <AppFullPage title={shoe.name}>
        <PageHeader full title={shoe.name}>
          {this._renderButtonGroup()}
        </PageHeader>
        <PageFrame fill scroll>
          <ShoeView activities={activities} shoe={shoe} />
        </PageFrame>
      </AppFullPage>
    );
  }

  _renderButtonGroup = () => {
    const {shoe, viewer} = this.props;

    if (viewer.id === shoe.user_id) {
      return (
        <ButtonGroup bsSize="small">
          <OverlayTrigger
            overlay={<Tooltip id="edit">Edit Shoe</Tooltip>}
            placement="bottom">
            <Button onClick={this._handleShoeEdit}>
              <MaterialIcon icon="pencil" />
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            overlay={<Tooltip id="delete">Delete Shoe</Tooltip>}
            placement="bottom">
            <Button onClick={this._handleShoeDelete}>
              <MaterialIcon icon="delete" />
            </Button>
          </OverlayTrigger>
          <ShoeModal
            initialShoe={shoe}
            onHide={() => this.setState({showModal: false})}
            show={this.state.showModal}
          />
        </ButtonGroup>
      );
    }
  };

  _handleShoeDelete = () => {
    if (confirm('Are you sure you want to delete this shoe?')) {
      this.props.dispatch(deleteShoe(this.props.shoe.id));
    }
  };

  _handleShoeEdit = () => {
    this.setState({showModal: true});
  };
}

module.exports = connect(mapStoreToProps)(ShoeController);
