/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const merge = require('webpack-merge');
const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const baseConfig = require('./webpack.base.config');

// many of the webpack directives need an absolute path
const basedir = path.resolve(__dirname, '../');

const devConfig = {
  // tells Webpack to do some stuff, including setting NODE_ENV
  mode: 'development',
  // generate source maps to help debug in browser
  // devtool: 'source-map',
  // where to build dev files to for webpack-serve to work
  output: {
    path: path.resolve(basedir, 'build', 'public'),
    pathinfo: true,
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].js',
    publicPath: 'http://localhost:2992/', // needed to get correct path in dev manifest file
  },
  plugins: [
    // this writes JS files for our Flask server to read
    new ManifestRevisionPlugin(
      path.resolve(basedir, 'build', 'manifest.json'), // keep this path in sync with FlaskWebpack config
      { rootAssetPath: './src', // important that this be relative, not absolute
        ignorePaths: [/.*\.DS_Store/], // need to manually ignore the .DS_Store files generated on OSX
      },
    ),
    // add an intermediate caching step to speed up builds (expect the first one)
    // new HardSourceWebpackPlugin(),
  ],
};

module.exports = merge.smart(baseConfig, devConfig);
