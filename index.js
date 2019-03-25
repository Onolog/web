// Load environment variables.
require('dotenv').config();

// Enable advanced ES features.
require('@babel/register')({
  plugins: [
    'dynamic-import-node',
  ],
});
require('@babel/polyfill');

// Ignore imported styles.
require('ignore-styles').default(['.css', '.sass', '.scss']);

require('./src/server');
