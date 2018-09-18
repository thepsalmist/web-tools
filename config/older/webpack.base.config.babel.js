import Config from 'webpack-config';
import path from 'path';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import autoprefixer from 'autoprefixer';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';

const SRC_DIR = './src';

export default new Config().merge({
  entry: {
    common_css: [
      `${SRC_DIR}/styles/base`,
      `${SRC_DIR}/styles/app/app`,
      `${SRC_DIR}/styles/viz/viz`,
    ],
  },
  resolve: {
    // Avoid having to require files with an extension if they are here.
    extensions: ['', '.js', '.jsx', '.css', '.scss'],
  },
  eslint: {
    useEslintrc: true,
  },
  postcss: () => [autoprefixer],
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        loader: 'eslint',
        include: path.join(__dirname, '../src'),
        exclude: '../src/components/vis/world-eckert3-lowres.js',
      },
    ],
    loaders: [
      {
        test: /\.scss$/i,
        loader: ExtractTextPlugin.extract('style', 'css!postcss!sass?sourceMap'),
      },
      {
        test: /\.css$/i,
        loader: 'style!css?modules',
        include: /flexboxgrid/,
      },
      {
        test: /\.(jpe?g|png|gif|svg([\?]?.*))$/i,
        loaders: [
          `file?context=${SRC_DIR}&name=[path][name].[hash].[ext]`,
          'image?bypassOnDebug&optimizationLevel=7&interlaced=false',
        ],
      },
    ],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new CaseSensitivePathsPlugin(),
  ],
});
