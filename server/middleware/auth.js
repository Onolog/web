import passport from 'passport';
import {Strategy} from 'passport-facebook';

import getJWT from '../utils/getJWT';
import graphql from '../../utils/graphql';

export function redirectIfAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/home');
}

export function requireAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

/**
 * Configure the Facebook strategy for use by Passport.
 *
 * OAuth 2.0-based strategies require a `verify` function which receives the
 * credential (`accessToken`) for accessing the Facebook API on the user's
 * behalf, along with the user's profile.  The function must invoke `cb`
 * with a user object, which will be set at `req.user` in route handlers after
 * authentication.
 */

const CONFIG = {
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_SECRET,
  callbackURL: '/auth/facebook/callback',
  profileFields: [
    'id',
    'displayName',
    'emails',
    'gender',
    'link',
    'name',
    'photos',
    'location',
  ],
  profileURL: 'https://graph.facebook.com/v3.0/me',
};

/**
 * Use the user's FB profile to check if he or she already exists. If not,
 * create a new user record before continuing.
 */
async function onVerify(accessToken, refreshToken, profile, next) {
  const {
    email,
    first_name,
    id,
    last_name,
    location,
  } = profile._json;

  try {
    // See if the user exists and create one if they don't.
    const data = await graphql(`
      mutation findOrCreateUser($id: ID!, $input: UserInput!) {
        findOrCreateUser(id: $id, input: $input) {
          id,
          name
        }
      }
    `, {
      authToken: getJWT({id}),
      variables: {
        id,
        input: {
          firstName: first_name,
          lastName: last_name,
          email,
          location: location && location.name,
        },
      },
    });

    next(null, data.findOrCreateUser);
  } catch (err) {
    next(err);
  }
}

function serializeUser(user, next) {
  next(null, user.id);
}

async function deserializeUser(id, next) {
  try {
    const data = await graphql(`
      query user($id: ID!) {
        user(id: $id) {
          id,
          firstName,
          lastName
        }
      }
    `, {
      authToken: getJWT({id}),
      variables: {
        id,
      },
    });

    return next(null, data.user);
  } catch (err) {
    next(err);
  }
}

passport.use(new Strategy(CONFIG, onVerify));
passport.serializeUser(serializeUser);
passport.deserializeUser(deserializeUser);

export default passport;
