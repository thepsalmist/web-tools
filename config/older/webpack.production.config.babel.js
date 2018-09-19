import Config from 'webpack-config';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';

export default new Config().extend('config/webpack.base.config.babel.js').merge({

  devtool: 'cheap-module-source-map',

  entry: {
    app_js: [
      'babel-polyfill',
    ],
  },

  bail: true, // stop after the first error

  module: {
    loaders: [
      {
        test: /\.js?$/i,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: path.join(__dirname, '../src'),
      },
    ],
  },

  plugins: [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': '"production"' }),
    new CleanWebpackPlugin(['server/static/gen'], {
      root: __dirname,
      verbose: true,
      dry: false,
    }),
    new HtmlWebpackPlugin({
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true,
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
    }),
    // Ensure CSS chunks get written to their own file.
    new ExtractTextPlugin('[name].[chunkhash:8].css'),
  ],

});
