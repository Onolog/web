import jwt from 'jsonwebtoken';

/**
 * Create a json web token to be passed in all API requests.
 */
export default function getJWT(payload={}) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
}
