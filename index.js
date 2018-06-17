// Load environment variables.
require('dotenv').config();

require('babel-polyfill');
require('babel-register')({
  ignore: /\/(public|node_modules)\//,
  presets: [
    'env',
    'react',
  ],
  plugins: [
    'syntax-object-rest-spread',
  ],
});

require('./server');
