import cx from 'classnames';
import {find, isEmpty, isEqual, partition} from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import {Button} from 'react-bootstrap';
import {connect} from 'react-redux';

import AppFullPage from '../../components/Page/AppFullPage.react';
import EmptyState from '../../components/EmptyState.react';
import LeftRight from '../../components/LeftRight/LeftRight.react';
import MaterialIcon from '../../components/Icons/MaterialIcon.react';
import PageFrame from '../../components/Page/PageFrame.react';
import PageHeader from '../../components/Page/PageHeader.react';
import ScrollContainer from '../../components/ScrollContainer/ScrollContainer.react';
import ShoeModal from '../../components/Shoes/ShoeModal.react';
import ShoeTable from '../../components/Shoes/ShoeTable.react';
import ShoeView from '../../components/Shoes/ShoeView.react';

import {makeRequest} from '../../actions';

import ActionTypes from '../../constants/ActionTypes';

import '../../components/Shoes/css/Shoe.scss';

const SectionHeader = (props) => (
  <h3 className={cx('section-header', props.className)}>
    {props.children}
  </h3>
);

/**
 * ShoesController.react
 *
 * View controller for displaying all of a user's shoes
 */
class ShoesController extends React.Component {
  state = {
    activeShoeId: 0,
    shoe: null,
    show: false,
  };

  componentWillMount() {
    this.props.fetchShoes(this.props.session.user.id);
  }

  componentWillReceiveProps(nextProps) {
    // Hide modal when shoes are modified somehow.
    if (!isEqual(this.props.shoes, nextProps.shoes)) {
      this.setState({show: false});
    }
  }

  render() {
    const {pendingRequests, shoes} = this.props;
    const isLoading =
      isEmpty(shoes) || pendingRequests[ActionTypes.SHOES_FETCH];

    return (
      <AppFullPage title="Shoes">
        <PageHeader full title="Shoes">
          <div>
            <Button bsSize="small" onClick={this._handleShowModal}>
              <MaterialIcon icon="plus" /> New Shoe
            </Button>
          </div>
        </PageHeader>
        <PageFrame fill isLoading={isLoading}>
          {this._renderContent(isLoading)}
          <ShoeModal
            initialShoe={this.state.shoe}
            onHide={this._handleHideModal}
            show={this.state.show}
          />
        </PageFrame>
      </AppFullPage>
    );
  }

  _renderContent = (isLoading) => {
    if (isLoading) {
      return null;
    }

    const [inactive, active] = partition(this.props.shoes.nodes, 'inactive');

    return (
      <div className="shoes-container">
        <ScrollContainer className="shoe-list-container">
          {this._renderActiveShoes(active)}
          {this._renderInactiveShoes(inactive)}
        </ScrollContainer>
        <ScrollContainer className="shoe-details">
          {this._renderShoeDetails()}
        </ScrollContainer>
      </div>
    );
  }

  _renderActiveShoes = (activeShoes) => {
    const contents = activeShoes && activeShoes.length ?
      <ShoeTable
        activeShoeId={this.state.activeShoeId}
        onView={this._handleShoeView}
        shoes={activeShoes}
      /> :
      <EmptyState>
        You do not have any active shoes to display.
      </EmptyState>;

    return (
      <div>
        <SectionHeader className="shoe-type">
          Active
        </SectionHeader>
        {contents}
      </div>
    );
  }

  _renderInactiveShoes = (inactiveShoes) => {
    if (inactiveShoes && inactiveShoes.length) {
      return (
        <div>
          <SectionHeader className="shoe-type">
            Inactive
          </SectionHeader>
          <ShoeTable
            activeShoeId={this.state.activeShoeId}
            onView={this._handleShoeView}
            shoes={inactiveShoes}
          />
        </div>
      );
    }
  }

  _renderShoeDetails = () => {
    const {activeShoeId} = this.state;

    if (!activeShoeId) {
      return (
        <EmptyState>
          No shoe selected.
        </EmptyState>
      );
    }

    const isLoading = this.props.pendingRequests[ActionTypes.SHOE_FETCH];
    const shoe = find(this.props.shoes.nodes, {id: activeShoeId});
    const activities = (shoe.activities && shoe.activities.nodes) || [];

    return [
      <div className="shoe-details-header" key="header">
        <LeftRight>
          <h4>{shoe.name}</h4>
          <Button bsSize="small" onClick={() => this._handleShoeEdit(shoe)}>
            <MaterialIcon icon="pencil" />
          </Button>
        </LeftRight>
      </div>,
      <ShoeView
        activities={activities}
        isLoading={isLoading}
        key="view"
        shoe={shoe}
      />,
    ];
  }

  _handleHideModal = () => {
    this.setState({
      shoe: null,
      show: false,
    });
  }

  _handleShoeEdit = (shoe) => {
    this.setState({
      shoe,
      show: true,
    });
  }

  _handleShoeView = (shoe) => {
    this.props.fetchShoe(shoe.id);
    this.setState({activeShoeId: shoe.id});
  }

  _handleShowModal = () => {
    this.setState({show: true});
  }
}

ShoesController.propTypes = {
  pendingRequests: PropTypes.object.isRequired,
  session: PropTypes.shape({
    user: PropTypes.shape({
      id: PropTypes.number,
    }),
  }),
  shoes: PropTypes.shape({
    nodes: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        inactive: PropTypes.bool,
        name: PropTypes.string,
        activities: PropTypes.shape({
          count: PropTypes.number,
          sumDistance: PropTypes.number,
        }),
      })
    ),
  }).isRequired,
};

const mapStateToProps = ({pendingRequests, session, shoes}) => {
  return {
    pendingRequests,
    session,
    shoes,
  };
};

const mapDispatchToProps = (dispatch) => ({
  fetchShoes: (userId) => dispatch(makeRequest(`
    query shoes($userId: ID) {
      shoes(userId: $userId) {
        nodes {
          id,
          inactive,
          name,
          activities {
            count,
            sumDistance,
          },
        }
      }
    }
  `, {userId}, ActionTypes.SHOES_FETCH)),
  fetchShoe: (shoeId) => dispatch(makeRequest(`
    query shoes($shoeId: ID) {
      shoes(shoeId: $shoeId) {
        nodes {
          id,
          brandId,
          model,
          name,
          size,
          sizeType,
          notes,
          activities {
            count,
            sumDistance,
            nodes {
              distance,
              duration,
              id,
              startDate,
              timezone,
            }
          },
        }
      }
    }
  `, {shoeId}, ActionTypes.SHOE_FETCH)),
});

module.exports = connect(mapStateToProps, mapDispatchToProps)(ShoesController);
