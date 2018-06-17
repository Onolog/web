import PropTypes from 'prop-types';
import React from 'react';
import {Table} from 'react-bootstrap';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {makeRequest} from '../actions';

class Shoes extends React.Component {
  componentWillMount() {
    this.props.fetchData(this.props.session.user.id);
  }

  render() {
    const {shoes} = this.props;

    if (shoes.nodes == null) {
      return <div>Loading...</div>;
    }

    const content = shoes.count === 0 ?
      <tr colSpan="3">
        <td>You don't have any shoes!</td>
      </tr> :
      <tbody>
        {shoes.nodes.map(({id, model}) => (
          <tr key={id}>
            <td>
              <Link to={`/shoes/${id}`}>
                {model}
              </Link>
            </td>
            <td></td>
            <td></td>
          </tr>
        ))}
      </tbody>;

    return (
      <div>
        <h1>Shoes</h1>
        <Table bordered>
          <thead>
            <tr>
              <th>Name</th>
              <th>Activities</th>
              <th>Miles</th>
            </tr>
          </thead>
          {content}
        </Table>
      </div>
    );
  }
};

Shoes.propTypes = {
  shoes: PropTypes.shape({
    count: PropTypes.number,
    nodes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number.isRequired,
      model: PropTypes.string.isRequired,
    })),
  }).isRequired,
};

const mapStateToProps = ({session, shoes}) => ({
  session,
  shoes,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (userId) => dispatch(makeRequest(`
    query shoes($userId: ID) {
      shoes(userId: $userId) {
        nodes {
          id,
          model,
        }
      }
    }
  `, {userId}, 'SHOES_FETCH')),
});

export default connect(mapStateToProps, mapDispatchToProps)(Shoes);
