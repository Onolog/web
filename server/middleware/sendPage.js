import React from 'react';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import {matchPath, StaticRouter} from 'react-router-dom';

import App from '../../components/App';

import {initializeSession} from '../../actions';
import createStore from '../../store';
import renderHtml from '../utils/renderHtml';
import routes from '../../routes';

export default async(req, res, next) => {
  const context = {};
  const store = createStore();

  // Add session data to the store.
  store.dispatch(initializeSession(req.session));

  const dataRequirements = [];
  routes.forEach((route) => {
    if (matchPath(req.url, route) && route.component.fetchData) {
      dataRequirements.push(store.dispatch(route.component.fetchData()));
    }
  });

  await Promise.all(dataRequirements);

  const dom = renderToString(
    <Provider store={store}>
      <StaticRouter context={context} location={req.url}>
        <App />
      </StaticRouter>
    </Provider>
  );

  res.send(renderHtml(dom, store.getState()));
};
