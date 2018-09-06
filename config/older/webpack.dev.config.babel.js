import Config from 'webpack-config';
import path from 'path';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import ManifestRevisionPlugin from 'manifest-revision-webpack-plugin';

export default new Config().extend('config/webpack.base.config.babel.js').merge({

  devtool: 'eval',

  entry: {
    app_js: [
      'babel-polyfill',
      'webpack/hot/dev-server',
    ],
  },

  output: {
    path: './build/public',
    pathinfo: true,
    publicPath: 'http://localhost:2992/src/',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js',
  },

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
    // Ensure CSS chunks get written to their own file.
    new ExtractTextPlugin('[name].[chunkhash].css'),
    // Create the manifest file that Flask and other frameworks use.
    new ManifestRevisionPlugin(path.join('build', 'manifest.json'), { rootAssetPath: './src' }),
  ],

});
