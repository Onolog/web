import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';

import App from './components/App';
import createStore from './store';

ReactDOM.hydrate(
  <Provider store={createStore(window.APP_DATA)}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
