function handleErrorDev(error, req, res, next) {
  // Just dump the error with a stack trace in dev to make debugging easier.
  res.status(error.status || 500);
  res.send(`<pre>${error.stack}</pre>`);
}

function handleErrorProd(error, req, res, next) {
  // TODO...
  res.status(error.status || 500);
  res.send(`<pre>${error.stack}</pre>`);
}

export function handleAppError(err, req, res, next) {
  if (req.app.get('env') === 'production') {
    return handleErrorProd(err, req, res, next);
  }

  return handleErrorDev(err, req, res, next);
}

export function handleServerError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  // Handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      /* eslint-disable-next-line no-console */
      console.error(`Port ${error.port} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      /* eslint-disable-next-line no-console */
      console.error(`Port ${error.port} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}
