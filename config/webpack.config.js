/* eslint import/no-extraneous-dependencies: 0 */
const path = require('path');
const merge = require('webpack-merge');
const devConfig = require('./webpack.dev.config');
const { prodConfig, prodConfigGenerator } = require('./webpack.prod.config');

// many of the webpack directives need an absolute path
const basedir = path.resolve(__dirname, '../');

// be smart about output based on dev or not
const isDevMode = process.env.NODE_ENV !== 'production';

// which tool is this (explorer, sources, topics, tools)
const mcAppName = process.env.MC_APP_NAME;

// tool specific build config - for dev or prod
const appConfig = {
  entry: {
    // the entry point for the explorer tool
    app_js: [path.resolve(basedir, 'src', `${mcAppName}Index.js`)],
    // the entry point for explorer-specific style sheets
    app_css: [path.resolve(basedir, 'src', 'styles', mcAppName, `${mcAppName}.scss`)],
  },
};

// special config for production builds
const extraProdConfig = prodConfigGenerator(basedir, mcAppName);

// combine the appropriate configurations based on dev or prod
module.exports = merge.smart(isDevMode ? devConfig : prodConfig, appConfig,
  isDevMode ? {} : extraProdConfig);
