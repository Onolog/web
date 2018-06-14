import fetch from 'isomorphic-fetch';

const URI = process.env.NODE_ENV === 'production' ?
  'https://api.onolog.com/' :
  'http://localhost:4000/';

export default function graphql(query, {authToken, variables}) {
  return fetch(URI, {
    method: 'POST',
    headers: {
      'Accept-Encoding': 'gzip',
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query, variables}),
  })
    .then((res) => res.json())
    .then((res) => res.data);
}
