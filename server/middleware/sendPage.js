import {createMemoryHistory} from 'history';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import {StaticRouter} from 'react-router-dom';

import App from '../../components/App';

import {initializeSession} from '../../actions';
import createStore from '../../store';
import renderHtml from '../utils/renderHtml';

export default (req, res, next) => {
  try {
    const context = {};
    const history = createMemoryHistory({initialEntries: [req.url]});
    const store = createStore(history, {/* Initial state */});

    // Add session data to the store.
    store.dispatch(initializeSession(req.session));

    const dom = renderToString(
      <Provider store={store}>
        <StaticRouter context={context} location={req.url}>
          <App />
        </StaticRouter>
      </Provider>
    );

    res.send(renderHtml(dom, store.getState()));
  } catch (err) {
    next(err);
  }
};
