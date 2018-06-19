import {Router} from 'express';
import moment from 'moment';
import passport from 'passport';

import {redirectIfAuthenticated, requireAuthentication} from './middleware/auth';
import sendPage from './middleware/sendPage';

const router = Router();

const AUTH_PATH = '/auth/facebook';
const HOME_PATH = moment().format('/YYYY/MM');
const LOGIN_PATH = '/login';

router.get('/', (req, res, next) => {
  res.redirect(req.isAuthenticated() ? HOME_PATH : LOGIN_PATH);
});

// Public pages
router.get([
  '/privacy',
  '/terms',
  '/vdot',
], sendPage);

router.get(LOGIN_PATH, redirectIfAuthenticated, sendPage);

router.get(
  AUTH_PATH,
  redirectIfAuthenticated,
  passport.authenticate('facebook', {
    scope: [
      'email',
      'public_profile',
      'user_friends',
      'user_location',
    ],
  })
);

router.get(
  `${AUTH_PATH}/callback`,
  redirectIfAuthenticated,
  passport.authenticate('facebook', {failureRedirect: LOGIN_PATH}),
  (req, res) => {
    const redirectPath = req.session.redirectPath || '/';
    delete req.session.redirectPath;
    res.redirect(redirectPath);
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect(LOGIN_PATH);
});

router.get('*', requireAuthentication, sendPage);

export default router;
