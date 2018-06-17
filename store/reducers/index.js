import {combineReducers} from 'redux';

const activitiesReducer = (state={}, action) => {
  switch (action.type) {
    case 'ACTIVITIES_FETCH_SUCCESS':
      return action.data.activities;
    default:
      return state;
  }
};

const sessionReducer = (state={}, action) => {
  switch (action.type) {
    case 'INITIALIZE_SESSION':
      return action.session;
    default:
      return state;
  }
};

const shoesReducer = (state={}, action) => {
  switch (action.type) {
    case 'SHOES_FETCH_SUCCESS':
      return action.data.shoes;
    default:
      return state;
  }
};

const userReducer = (state={}, action) => {
  switch (action.type) {
    case 'USER_FETCH_SUCCESS':
      return action.data.user;
    default:
      return state;
  }
};

export default combineReducers({
  activities: activitiesReducer,
  session: sessionReducer,
  shoes: shoesReducer,
  user: userReducer,
});
