import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';

import graphql from '../utils/graphql';
import {userFetch} from '../actions';

const fetchData = () => (dispatch, getState) => {
  const {authToken, user} = getState().session;

  return graphql(`
    query user($id: ID!) {
      user(id: $id) {
        id,
        firstName,
        lastName,
        name,
        activities(userId: $id) {
          count,
        }
      }
    }
  `, {
    authToken,
    variables: {
      id: user.id,
    },
  })
  .then((data) => {
    dispatch(userFetch(data.user));
  });
};

class Home extends React.Component {
  componentWillMount() {
    if (!this.props.user.id) {
      console.log('client fetch');
      this.props.fetchData();
    }
  }

  render() {
    const {user} = this.props;

    if (!user.id) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <p>
          Welcome to Onolog, {user.firstName}! | <a href="/logout">Log Out</a>
        </p>
        <h3>{user.name}</h3>
        <ul>
          {Object.keys(user).map(key => {
            let value = user[key];
            if (key === 'activities') {
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

Home.fetchData = fetchData;

const mapStateToProps = ({user}) => ({
  user,
});

const mapDispatchToProps = {
  fetchData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
