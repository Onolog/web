import {connectRouter, routerMiddleware} from 'connected-react-router';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

export default (history, initialState) => createStore(
  connectRouter(history)(rootReducer),
  initialState,
  applyMiddleware(thunk, routerMiddleware(history))
);
