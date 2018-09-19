import webpack from 'webpack';
import Config from 'webpack-config';
import ManifestRevisionPlugin from 'manifest-revision-webpack-plugin';
import path from 'path';

const appConfig = {
  entry: {
    app_js: [
      './src/topicsIndex',
    ],
    app_css: [
      './src/styles/topics/topics',
    ],
  },
};

if (process.env.NODE_ENV === 'production') {
  appConfig.output = {
    path: './server/static/gen/topics',
    publicPath: '/static/gen/topics/',
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[id].[chunkhash:8].chunk.js',
  };
  appConfig.plugins = [
    // Create the manifest file that Flask and other frameworks use.
    new ManifestRevisionPlugin(path.join('server', 'static', 'gen', 'topics', 'manifest.json'), {
      rootAssetPath: './src',
    }),
  ];
}

export default new Config().extend('config/webpack.[NODE_ENV].config.babel.js').merge(appConfig);
