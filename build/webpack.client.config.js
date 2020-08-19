const webpack = require('webpack');
const consola = require('consola');
const { merge } = require('webpack-merge');
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const baseConfig = require('./webpack.base.config');

const isProd = process.env.NODE_ENV === 'production';

module.exports = merge(baseConfig, {
  entry: {
    app: './src/entry-client.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: isProd
          ? ['vue-style-loader', MiniCssExtractPlugin.loader, 'css-loader']
          : ['vue-style-loader', 'css-loader'],
      },
      {
        test: /\.less$/,
        use: isProd
          ? [
              'vue-style-loader',
              MiniCssExtractPlugin.loader,
              'css-loader',
              'less-loader',
            ]
          : ['vue-style-loader', 'css-loader', 'less-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  },
  plugins: [
    new VueSSRClientPlugin(),
    new MiniCssExtractPlugin({
      filename: isProd ? '[name].[hash].css' : '[name].css',
      chunkFilename: isProd ? '[id].[hash].css' : '[id].css',
    }),
    new WebpackBar({
      name: 'client',
      color: 'green',
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
      'process.env.VUE_ENV': '"client"',
    }),
  ],
});
