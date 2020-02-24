import passport from 'passport';
import { Strategy } from 'passport-facebook';

import getJWT from '../utils/getJWT';
import getHomePath from '../../utils/getHomePath';
import graphql from '../../utils/graphql';

import { AUTH_CALLBACK_PATH, INDEX_PATH } from '../../constants/paths';

export const handleAuth = passport.authenticate('facebook', {
  scope: [
    'email',
    'public_profile',

    // App needs review for the following permissions:
    // 'user_friends',
    // 'user_location',
  ],
});

export const handleAuthCallback = passport.authenticate('facebook', {
  failureRedirect: INDEX_PATH,
});

export function redirectIfAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect(getHomePath());
}

export function requireAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  req.session.redirectPath = req.url;
  res.redirect(INDEX_PATH);
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
  callbackURL: `${process.env.DOMAIN}${AUTH_CALLBACK_PATH}`,
  clientID: process.env.FB_APP_ID,
  clientSecret: process.env.FB_SECRET,
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
  /* eslint-disable camelcase,no-underscore-dangle */
  const {
    email,
    first_name,
    id,
    last_name,
    location,
  } = profile._json;
  /* eslint-enable camelcase,no-underscore-dangle */

  try {
    // See if the user exists and create one if they don't.
    const data = await graphql(`
      mutation login($id: ID!, $input: UserInput!) {
        login(id: $id, input: $input) {
          id,
          name
        }
      }
    `, {
      authToken: getJWT({ id }),
      variables: {
        id,
        input: {
          email,
          firstName: first_name,
          lastName: last_name,
          location: location && location.name,
        },
      },
    });

    next(null, data.login);
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
          lastName,
          name,
          distanceUnits,
          location,
          timezone,
        }
      }
    `, {
      authToken: getJWT({ id }),
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
