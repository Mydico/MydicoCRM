const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  target: 'node',
  entry: {
    app: ['./src/main.ts']
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {}
  },
  mode: 'production',
  node: {
    __filename: false,
    __dirname: false
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts?$/,
        exclude: /node_module/
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: true
        }
      })
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'prod'
    }),
    new webpack.IgnorePlugin({
      checkResource(resource) {
        const lazyImports = [
          '@nestjs/microservices',
          '@nestjs/microservices/microservices-module',
          '@nestjs/websockets',
          '@nestjs/websockets/socket-module',
          '@nestjs/platform-express',
        ];
        if (!lazyImports.includes(resource)) {
          return false;
        }
        try {
          require.resolve(resource);
        } catch (err) {
          return true;
        }
        return false;
      }
    })
  ],
  externals: {
    '@nestjs/microservices': 'nestjs/microservices',
    'cache-manager': 'cache-manager',
    'fastify-swagger': 'fastify-swagger',
    'aws-sdk': 'aws-sdk',
    sqlite3: 'commonjs sqlite3'
  }
};
