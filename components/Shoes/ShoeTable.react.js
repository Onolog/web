import cx from 'classnames';
import { sortBy } from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import { Table } from 'react-bootstrap';

import Distance from '../Distance/Distance.react';
import MaterialIcon from '../Icons/MaterialIcon.react';

class ShoeTable extends React.Component {
  static displayName = 'ShoeTable';

  static propTypes = {
    activeShoeId: PropTypes.number.isRequired,
    onView: PropTypes.func.isRequired,
    shoes: PropTypes.arrayOf(
      PropTypes.shape({
        activities: PropTypes.object,
        id: PropTypes.number,
        inactive: PropTypes.bool,
        mileage: PropTypes.number,
        name: PropTypes.string,
      })
    ).isRequired,
  };

  state = {
    order: 'asc',
    sortBy: 'name',
  };

  render() {
    const shoes = sortBy(this.props.shoes, ({ activities }) => (
      activities[this.state.sortBy]
    ));

    if (this.state.order === 'desc') {
      shoes.reverse();
    }

    return (
      <Table hover>
        <thead>
          <tr>
            <th onClick={() => this._handleHeaderClick('name')}>
              Name {this._renderArrow('name')}
            </th>
            <th
              className="activities"
              onClick={() => this._handleHeaderClick('count')}>
              Activities {this._renderArrow('count')}
            </th>
            <th
              className="mileage"
              onClick={() => this._handleHeaderClick('sumDistance')}>
              <Distance.Label />
              {' '}
              {this._renderArrow('sumDistance')}
            </th>
          </tr>
        </thead>
        <tbody>
          {shoes.map(this._renderRow)}
        </tbody>
      </Table>
    );
  }

  _renderArrow = (sortBy) => {
    if (this.state.sortBy === sortBy) {
      return (
        <MaterialIcon
          icon={`menu-${this.state.order === 'asc' ? 'up' : 'down'}`}
        />
      );
    }
  }

  _renderRow = (shoe) => {
    const { activeShoeId, onView } = this.props;

    return (
      <tr
        className={cx({
          active: shoe.id === activeShoeId,
          inactive: !!shoe.inactive,
        })}
        key={shoe.id}
        onClick={() => onView(shoe)}>
        <td>
          {shoe.name}
        </td>
        <td className="activities">
          {shoe.activities.count}
        </td>
        <td className="mileage">
          <Distance distance={shoe.activities.sumDistance} label={false} />
        </td>
      </tr>
    );
  }

  _handleHeaderClick = (sortBy) => {
    let order;
    if (this.state.sortBy === sortBy) {
      order = this.state.order === 'asc' ? 'desc' : 'asc';
    } else if (sortBy === 'name') {
      order = 'asc';
    } else {
      order = 'desc';
    }

    this.setState({ order, sortBy });
  }
}

export default ShoeTable;
