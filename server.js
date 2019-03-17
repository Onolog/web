import debug from 'debug';
import http from 'http';

import { name } from './package.json';
import app from './server/app';
import { handleServerError } from './server/middleware/errorHandlers';

// Initialize and start the server.
const server = http.createServer(app);

server.on('error', handleServerError);

server.listen(process.env.PORT, () => {
  debug(`${name}:server`)(`Listening on port ${server.address().port}`);
});
