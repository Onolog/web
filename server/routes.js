import {Router} from 'express';
import passport from 'passport';

import {redirectIfAuthenticated, requireAuthentication} from './middleware/auth';
import sendPage from './middleware/sendPage';

const router = Router();

router.get('/', (req, res, next) => {
  res.redirect(req.isAuthenticated() ? '/home' : '/login');
});

router.get('/login', redirectIfAuthenticated, sendPage);

router.get(
  '/auth/facebook',
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
  '/auth/facebook/callback',
  redirectIfAuthenticated,
  passport.authenticate('facebook', {failureRedirect: '/login'}),
  (req, res) => {
    const redirectPath = req.session.redirectPath || '/';
    delete req.session.redirectPath;
    return res.redirect(redirectPath);
  }
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

router.get('*', requireAuthentication, sendPage);

export default router;
