/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const WebpackBar = require('webpackbar');
const ESLintPlugin = require('eslint-webpack-plugin');

// many of the webpack directives need an absolute path
const basedir = path.resolve(__dirname, '../');

const baseConfig = {
  entry: {
    // the entrypoint for shared CSS used across all the apps
    common_css: [path.resolve(basedir, 'src', 'styles', 'app', 'app.scss')],
  },
  resolve: {
    fallback: {
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
    },
  },
  plugins: [
    // needed this to get eslint working for some reason
    new webpack.LoaderOptionsPlugin({ options: {} }),
    // this writes CSS files for our Flask server to read
    new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
    // strip out all the locales from moment.js except `en` (saves > 100kB)
    new MomentLocalesPlugin(),
    // run linting check on all the javascript code before trying to compile it
    new ESLintPlugin({
      extensions: ['js', 'jsx'],
      exclude: 'node_modules', // we don't want to check the imported packages for formatting
    }),
    // provide much cleaner feedback while building on the command line
    new WebpackBar(),
    new webpack.DefinePlugin({ MC_VERSION: JSON.stringify(require(path.resolve(basedir, 'package.json')).version) }),
  ],
  stats: 'minimal',
  module: {
    rules: [
      { // compile all our javascript code
        test: /\.(js|jsx)$/,
        include: path.resolve(basedir, 'src'), // don't compile imported packages
        use: [
          'cache-loader', // cache the transpiled files to make builds slightly faster
          { loader: 'babel-loader' }, // run all the code through bable to transpile it down to vanilla JS
          // don't put options here; otherwise they override what is in the .babelrc
        ],
      },
      { // compile the scss for react-flexbox-grid by itself because it doesn't work wth MiniCssExtractPlugin for some reason
        test: /\.css$/,
        include: /flexboxgrid/,
        use: ['style-loader', 'css-loader'],
      },
      { // turn all our SCSS into regular CSS
        test: /\.(scss|css)$/,
        use: [
          MiniCssExtractPlugin.loader, // focus on the CSS, and stick it in an external file
          'css-loader',
          'sass-loader',
        ],
        exclude: /flexboxgrid/, // and make sure it doesn't try to compile the already-compiled files
      },
    ],
  },
};

module.exports = baseConfig;
