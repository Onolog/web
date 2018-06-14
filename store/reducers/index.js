import {combineReducers} from 'redux';

const sessionReducer = (state={}, action) => {
  switch (action.type) {
    case 'INITIALIZE_SESSION':
      return action.session;
    default:
      return state;
  }
};

const dataReducer = (state=[], action) => {
  switch (action.type) {
    case 'STORE_DATA':
      return action.data;
    default:
      return state;
  }
};

const userReducer = (state={}, action) => {
  switch (action.type) {
    case 'USER_FETCH':
      return action.user;
    default:
      return state;
  }
};

export default combineReducers({
  session: sessionReducer,
  data: dataReducer,
  user: userReducer,
});
