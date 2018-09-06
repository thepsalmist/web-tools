import webpack from 'webpack';
import Config from 'webpack-config';
import ManifestRevisionPlugin from 'manifest-revision-webpack-plugin';
import path from 'path';

const appConfig = {
  entry: {
    app_js: [
      './src/sourcesIndex',
    ],
    app_css: [
      './src/styles/sources/sources',
    ],
  },
};

if (process.env.NODE_ENV === 'production') {
  appConfig.output = {
    path: './server/static/gen/sources',
    publicPath: '/static/gen/sources/',
    filename: '[name].[chunkhash:8].js',
    chunkFilename: '[id].[chunkhash:8].chunk.js',
  };
  appConfig.plugins = [
    // Create the manifest file that Flask and other frameworks use.
    new ManifestRevisionPlugin(path.join('server', 'static', 'gen', 'sources', 'manifest.json'), {
      rootAssetPath: './src',
    }),
  ];
}

export default new Config().extend('config/webpack.[NODE_ENV].config.babel.js').merge(appConfig);
