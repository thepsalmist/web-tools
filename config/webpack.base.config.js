/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const webpack = require('webpack');
const ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// many of the webpack directives need an absolute path
const basedir = path.resolve(__dirname, '../');

const baseConfig = {
  entry: {
    // the entrypoint for shared CSS used across all the apps
    common_css: [path.resolve(basedir, 'src', 'styles', 'app', 'app.scss')],
  },
  plugins: [
    // needed this to get eslint working for some reason
    new webpack.LoaderOptionsPlugin({ options: {} }),
    // this writes JS files for our Flask server to read
    new ManifestRevisionPlugin(
      path.resolve(basedir, 'build', 'manifest.json'), // keep this path in sync with FlaskWebpack config
      { rootAssetPath: './src' } // important that this be relative, not absolute
    ),
    // this writes CSS files for our Flask server to read
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
  ],
  module: {
    rules: [
      { // run linting check on all the javascript code before trying to compile it
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/, // we don't want to check the imported packages for formatting
        use: 'eslint-loader', // use eslint as the engine for checking linting
      },
      { // compile all our javascript code
        test: /\.(js|jsx)$/,
        exclude: /node_modules/, // we don't want to recompile the imported packages
        use: {
          loader: 'babel-loader', // run all the code through bable to transpile it down to vanilla JS
          // don't put options here; otherwise they override what is in the .babelrc
        },
      },
      { // compile the scss for react-flexbox-grid by itself because it doesn't work wth MiniCssExtractPlugin for some reason
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        include: /flexboxgrid/,
      },
      { // turn all our SCSS into regular CSS
        test: /\.(scss|css)$/,
        loaders: [
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
