import graphql from '../utils/graphql';

export const makeRequest = (query, variables, type) => (dispatch, getState) => {
  if (!query || !type) {
    throw Error('Your request must include a query and an action type.');
  }

  dispatch({type});

  const {authToken} = getState().session;

  return graphql(query, {authToken, variables})
    .then((data) => dispatch({
      data,
      type: `${type}_SUCCESS`,
    }))
    .catch((error) => dispatch({
      error,
      type: `${type}_ERROR`,
    }));
};

export const initializeSession = (session) => ({
  type: 'INITIALIZE_SESSION',
  session,
});
