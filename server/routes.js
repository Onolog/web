import {Router} from 'express';
import passport from 'passport';

import {redirectIfAuthenticated, requireAuthentication} from './middleware/auth';
import sendPage from './middleware/sendPage';
import getHomePath from './utils/getHomePath';

import {AUTH_PATH, AUTH_CALLBACK_PATH, INDEX_PATH, LOGOUT_PATH, PUBLIC_PATHS} from '../constants/paths';

const router = Router();

router.get(INDEX_PATH, redirectIfAuthenticated, sendPage);
router.get(PUBLIC_PATHS, sendPage);

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
  AUTH_CALLBACK_PATH,
  redirectIfAuthenticated,
  passport.authenticate('facebook', {failureRedirect: INDEX_PATH}),
  (req, res) => {
    const redirectPath = req.session.redirectPath || INDEX_PATH;
    delete req.session.redirectPath;
    res.redirect(redirectPath);
  }
);

router.get(LOGOUT_PATH, (req, res) => {
  req.logout();
  res.redirect(INDEX_PATH);
});

router.get('*', requireAuthentication, sendPage);

export default router;
