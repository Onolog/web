import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import {makeRequest} from '../actions';

class Home extends React.Component {
  componentWillMount() {
    if (!this.props.user.id) {
      this.props.fetchData(this.props.session.user.id);
    }
  }

  render() {
    const {user} = this.props;

    if (!user.id) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <h1>{user.name}</h1>
        <ul>
          {Object.keys(user).map(key => {
            let value = user[key];
            if (key === 'activities' || key === 'shoes') {
              value = user[key].count;
            }
            return <li key={key}><strong>{key}:</strong> {value}</li>;
          })}
        </ul>
      </div>
    );
  }
};

Home.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string,
    name: PropTypes.string,
  }).isRequired,
};

const mapStateToProps = ({session, user}) => ({
  session,
  user,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (id) => dispatch(makeRequest(`
    query user($id: ID!) {
      user(id: $id) {
        id,
        firstName,
        lastName,
        name,
        activities(userId: $id) {
          count,
        },
        shoes(userId: $id) {
          count,
        }
      }
    }
  `, {id}, 'USER_FETCH')),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
