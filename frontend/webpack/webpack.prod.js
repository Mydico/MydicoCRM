const webpack = require('webpack');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const sass = require('sass');

const utils = require('./utils.js');
const commonConfig = require('./webpack.common.js');

const ENV = 'production';

module.exports = merge(commonConfig({ env: ENV }), {
  devtool: false,
  mode: ENV,
  entry: {
    main: './src/index.js'
  },
  cache: {
    type: 'filesystem',
    compression: 'gzip',
    hashAlgorithm: 'md4'
  },
  output: {
    path: utils.root('target/classes/static/'),
    filename: 'app/[name].[contenthash].bundle.js',
    chunkFilename: 'app/[name].[contenthash].chunk.js'
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.s?css$/,
        loader: 'stripcomment-loader'
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
              esModule: false,
            }
          },
          'css-loader',
          {
            loader: 'sass-loader',
            options: { implementation: sass }
          }
        ]
      },
    ]
  },
  optimization: {
    runtimeChunk: false,
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        // sourceMap: true, // Enable source maps. Please note that this will slow down the build
        terserOptions: {
          ecma: 6,
          module: true,
          compress: {
            warnings: false,
            ecma: 6,
            module: true,
            toplevel: true
          },
          output: {
            indent_level: 2,
            ecma: 6
          },
          mangle: {
            keep_fnames: true,
            module: true,
            toplevel: true
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      filename: 'content/[name].[contenthash].css',
      chunkFilename: 'content/[name].[contenthash].css'
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new MomentLocalesPlugin({
      localesToKeep: [
        'en',
        'vi'
        // jhipster-needle-i18n-language-moment-webpack - JHipster will add/remove languages in this array
      ]
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false
    })
  ]
});
