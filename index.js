// Load environment variables.
require('dotenv').config();

// Enable advanced ES features.
require('@babel/polyfill');
require('@babel/register');

// Ignore imported styles.
require('ignore-styles').default(['.css', '.sass', '.scss']);

require('./src/server');
