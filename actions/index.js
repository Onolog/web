export const initializeSession = (session) => ({
  type: 'INITIALIZE_SESSION',
  session,
});

export const storeData = (data) => ({
  type: 'STORE_DATA',
  data,
});

export const userFetch = (user) => ({
  type: 'USER_FETCH',
  user,
});
