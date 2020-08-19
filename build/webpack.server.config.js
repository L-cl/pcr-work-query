const webpack = require('webpack');
const consola = require('consola');
const { merge } = require('webpack-merge');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
const WebpackBar = require('webpackbar');
const webpackNodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.config');

const isProd = process.env.NODE_ENV === 'production';

module.exports = merge(baseConfig, {
  entry: {
    app: './src/entry-server.js',
  },
  output: {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: ['vue-style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  plugins: [
    new VueSSRServerPlugin(),
    new WebpackBar({
      name: 'server',
      color: 'orange',
      reporter: isProd
        ? {}
        : {
            allDone() {
              consola.ready({
                message: `Server listening on http://localhost:8280`,
                badge: true,
              });
            },
          },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development'
      ),
      'process.env.VUE_ENV': '"server"',
    }),
  ],
  externals: [
    webpackNodeExternals({
      allowlist: /\.css$/,
    }),
  ],
});
