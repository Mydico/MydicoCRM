const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
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

module.exports = webpackMerge(commonConfig({ env: ENV }), {
  devtool: 'source-map',
  mode: ENV,
  entry: {
    main: './src/index.js'
  },
  output: {
    path: utils.root('target/classes/static/'),
    filename: 'app/[name].[hash].bundle.js',
    chunkFilename: 'app/[name].[hash].chunk.js'
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
              publicPath: '../'
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
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        // sourceMap: true, // Enable source maps. Please note that this will slow down the build
        terserOptions: {
          ecma: 6,
          toplevel: true,
          module: true,
          beautify: false,
          comments: false,
          compress: {
            warnings: false,
            ecma: 6,
            module: true,
            toplevel: true
          },
          output: {
            comments: false,
            beautify: false,
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
      filename: 'content/[name].[hash].css',
      chunkFilename: 'content/[name].[hash].css'
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
