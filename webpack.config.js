const path = require('path');

const config = {
  context: path.join(__dirname),
  entry: {
    package: './client.js',
    vendor: [
      'prop-types',
      'react',
      'react-dom',
      'react-redux',
      'react-router-dom',
      'redux',
      'redux-thunk',
    ],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
    ],
  },
  output: {
    chunkFilename: '[name].js',
    filename: '[name].js',
    path: path.resolve(__dirname, 'public', 'build'),
    publicPath: '/build/',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
    ],
  },
};

module.exports = config;
