// @flow

import {routerMiddleware} from 'connected-react-router';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';

import createRootReducer from './reducers';

import type {History} from '../types/History';

export default (history: History, initialState: Object) => createStore(
  createRootReducer(history),
  initialState,
  applyMiddleware(thunk, routerMiddleware(history))
);
