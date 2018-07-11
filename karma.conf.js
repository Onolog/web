const webpackConfig = require('./webpack.config')('', {
  mode: 'development',
});

module.exports = function(config) {
  config.set({
    browsers: [process.env.TRAVIS ? 'Chrome_travis_ci' : 'Chrome'],
    client: {
      captureConsole: true,
    },
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
    },
    frameworks: ['mocha', 'chai'],
    singleRun: true,
    files: [
      'webpack.test.config.js',
    ],
    preprocessors: {
      'webpack.test.config.js': ['webpack', 'sourcemap'],
    },
    reporters: ['dots'],
    webpack: Object.assign(webpackConfig, {
      devtool: 'inline-source-map',
    }),
    webpackMiddleware: {
      stats: 'errors-only',
    },
    webpackServer: {
      noInfo: true,
    },
  });
};
