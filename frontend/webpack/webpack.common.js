const path = require('path');
const webpack = require('webpack');
const { BaseHrefWebpackPlugin } = require('base-href-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MergeJsonWebpackPlugin = require('merge-jsons-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const utils = require('./utils.js');

const getJSLoaderRule = env => {
  const rules = [
    {
      loader: 'cache-loader',
      options: {
        cacheDirectory: path.resolve('target/cache-loader')
      }
    },
    {
      loader: 'thread-loader',
      options: {
        // There should be 1 cpu for the fork-ts-checker-webpack-plugin.
        // The value may need to be adjusted (e.g. to 1) in some CI environments,
        // as cpus() may report more cores than what are available to the build.
        workers: require('os').cpus().length - 1
      }
    },
    // {
    //   loader: `postcss-loader`,
    //   options: {
    //     ident: 'postcss-scss',
    //     syntax: 'postcss-scss',
    //     plugins: () => [require('postcss-flexbugs-fixes')()]
    //   }
    // },
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env', '@babel/preset-react']
      }
    }
  ];
  if (env === 'development') {
    rules.unshift({
      loader: 'react-hot-loader/webpack'
    });
  }
  return rules;
};

module.exports = options => ({
  cache: options.env !== 'production',
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    modules: ['node_modules'],
    fallback: { path: require.resolve('path-browserify'), fs: false, crypto: false }
    // alias: utils.mapTypescriptAliasToWebpackAlias()
  },
  externals: [{ './cptable': 'var cptable' }, { './jszip': 'jszip' }],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: getJSLoaderRule(options.env),
        include: [utils.root('.')],
        exclude: [utils.root('node_modules')]
      },
      {
        test: /\.(jpe?g|png|gif|svg|woff2?|ttf|eot)$/i,
        loader: 'file-loader',
        options: {
          digest: 'hex',
          hash: 'sha512',
          name: 'content/[hash].[ext]'
        }
      },
      {
        test: [/\.js?$/, /\.ts?$/, /\.jsx?$/, /\.tsx?$/],
        enforce: 'pre',
        exclude: /node_modules/,
        use: ['source-map-loader']
      },
      {
        test: /\.(j|t)sx?$/,
        enforce: 'pre',
        loader: 'eslint-loader',
        exclude: [utils.root('node_modules')]
      }
    ]
  },
  stats: {
    children: false
  },
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'process.env.NODE_ENV': `'${options.env}'`,
        BUILD_TIMESTAMP: `'${new Date().getTime()}'`,
        __REACT_DEVTOOLS_GLOBAL_HOOK__: '({ isDisabled: true })',
        // APP_VERSION is passed as an environment variable from the Gradle / Maven build tasks.
        VERSION: `'${process.env.hasOwnProperty('APP_VERSION') ? process.env.APP_VERSION : 'DEV'}'`,
        DEBUG_INFO_ENABLED: options.env === 'development',
        // The root URL for API calls, ending with a '/' - for example: `"https://www.jhipster.tech:8081/myservice/"`.
        // If this URL is left empty (""), then it will be relative to the current context.
        // If you use an API server, in `prod` mode, you will need to enable CORS
        // (see the `jhipster.cors` common JHipster property in the `application-*.yml` configurations)
        SERVER_API_URL: `''`
      }
    }),

    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
      JSZip: 'jszip'
    }),
    new ForkTsCheckerWebpackPlugin({ eslint: true }),
    new CopyWebpackPlugin({
      patterns: [
        // {from: './content/', to: 'content'},
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: './public/manifest.webapp', to: 'manifest.webapp' },
        { from: './public/robots.txt', to: 'robots.txt' },
        { from: './public/avatars', to: 'avatars' }
      ]
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      chunksSortMode: 'auto',
      inject: 'body'
    }),
    new BaseHrefWebpackPlugin({ baseHref: '/' }),
    new MergeJsonWebpackPlugin({
      output: {
        groupBy: [
          { pattern: './i18n/en/*.json', fileName: './i18n/en.json' },
          { pattern: './i18n/vi/*.json', fileName: './i18n/vi.json' }
          // jhipster-needle-i18n-language-webpack - JHipster will add/remove languages in this array
        ]
      }
    })
  ]
});
