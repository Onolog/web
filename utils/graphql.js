import fetch from 'isomorphic-fetch';

function handleGraphQLError(error) {
  /* eslint-disable-next-line no-console */
  console.error(`GraphQL Error: ${error.message}`, error);
}

export default function graphql(query, {authToken, variables}) {
  return fetch(process.env.API_URL, {
    method: 'POST',
    headers: {
      'Accept-Encoding': 'gzip',
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query, variables}),
  })
    .then((res) => res.json())
    .then(({data, errors}) => {
      if (errors) {
        // Even when there are errors, some of the data returned may be valid.
        // Log the errors, but return the data.
        errors.forEach(handleGraphQLError);
      }
      return data;
    })
    .catch(handleGraphQLError);
}
