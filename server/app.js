import compression from 'compression';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import csrf from 'csurf';
import express from 'express';
import helmet from 'helmet';
import httpError from 'http-errors';
import moment from 'moment';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';
import path from 'path';
import favicon from 'serve-favicon';

import passport from './middleware/auth';
import { handleAppError } from './middleware/errorHandlers';
import routes from './routes';
import getJWT from './utils/getJWT';

const { API_URL, COOKIE_SECRET, DOMAIN, NODE_ENV } = process.env;

const PROD = NODE_ENV === 'production';
const PUBLIC_PATH = path.join(__dirname, '../public');

// The site domain and API url should be explicitly set. This check can be
// commented out for local testing.
if (PROD && (DOMAIN + API_URL).indexOf('localhost') > -1) {
  throw Error(
    'This is a production environment, but the site domain and/or API url ' +
    'are set to `localhost`. This is probably wrong, unless you want to ' +
    'locally test a prod-like environment.'
  );
}

const app = express();

// Add middleware.
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(cookieParser(COOKIE_SECRET));
app.use(cookieSession({
  // Set a long expiration time so people don't have to login often.
  // https://github.com/expressjs/cookie-session#cookie-options
  expires: moment().add(1, 'year').toDate(),
  name: 'session',
  secret: COOKIE_SECRET,
}));

// Authentication
app.use(passport.initialize());
app.use(passport.session());

// Make the user data and auth token available as part of the session.
app.use((req, res, next) => {
  req.session.authToken = getJWT(req.user);
  req.session.user = req.user;
  next();
});

app.use(cors({
  credentials: true,
  origin: true,
}));

app.use(csrf({
  ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
}));

app.use(helmet());

if (PROD) {
  app.use(compression());
}

// Set static resources path.
app.use(express.static(PUBLIC_PATH));
app.use(favicon(path.join(PUBLIC_PATH, 'favicon.ico')));
app.use(sassMiddleware({
  dest: PUBLIC_PATH,
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
  src: PUBLIC_PATH,
}));

// Set routes.
app.use(routes);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(httpError(404));
});

// Catch-all error handler.
app.use(handleAppError);

export default app;
