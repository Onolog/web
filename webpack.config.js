const ManifestPlugin = require('webpack-manifest-plugin');
const Md5HashPlugin = require('webpack-md5-hash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const path = require('path');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const PROD = argv.mode === 'production';

  return {
    context: path.join(__dirname),
    entry: {
      app: './client.js',
      vendor: [
        'classnames',
        'history',
        'isomorphic-fetch',
        'lodash',
        'moment',
        'moment-timezone',
        'prop-types',
        'react',
        'react-bootstrap',
        'react-dom',
        'react-redux',
        'react-router-bootstrap',
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
          use: ['babel-loader'],
          // use: {
          //   loader: 'babel-loader',
          //   options: {
          //     cacheDirectory: true,
          //   },
          // },
        },
        {
          test: /\.css$/,
          use: [
            // PROD ? MiniCssExtractPlugin.loader : 'style-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 0,
                modules: false,
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            // PROD ? MiniCssExtractPlugin.loader : 'style-loader',
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                modules: false,
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.(eot|svg|ttf|woff|woff2)$/,
          use: 'file-loader',
        },
        {
          // Inline base64 URLs for <=8k images, direct URLs for the rest
          test: /\.(png|jpg)$/,
          use: 'url-loader?limit=8192',
        },
      ],
    },
    optimization: {
      minimizer: [
        new OptimizeCSSAssetsPlugin({}),
        new UglifyJsPlugin({
          cache: true,
          uglifyOptions: {
            output: {
              comments: false,
            },
          },
        }),
      ],
      splitChunks: {
        minChunks: Infinity,
        name: 'vendor',
      },
    },
    output: {
      chunkFilename: PROD ? '[name]-[chunkhash:16].js' : '[name].js',
      filename: PROD ? '[name]-[chunkhash:16].js' : '[name].js',
      path: path.resolve(__dirname, 'public', 'build'),
      publicPath: '/build/',
    },
    plugins: [
      // Don't pull in all of Moment's locales
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new Md5HashPlugin(),
      new ManifestPlugin({
        fileName: 'webpack-manifest.json',
      }),
      new MiniCssExtractPlugin({
        filename: PROD ? '[name]-[contenthash:16].css' : '[name].css',
      }),
    ],
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
      modules: [
        path.resolve(__dirname, 'node_modules'),
      ],
    },
  };
};
