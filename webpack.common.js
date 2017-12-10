const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const paths = {
  DIST: path.resolve(__dirname, 'dist'),
  SRC: path.resolve(__dirname, 'src'),
  JS: path.resolve(__dirname, 'src/js'),
  SCSS: path.resolve(__dirname, 'src/scss'),
  PUBLISH: path.resolve(__dirname, '../production')
};

const extractSass = new ExtractTextPlugin({
    filename: '[name].[contenthash].css',
    disable: process.env.NODE_ENV === "development"
});

const config = {
  entry: {
    app: path.join(paths.JS, 'index.js')
  },
  output: {
    path: paths.PUBLISH,
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin([paths.DIST]),
    new HtmlWebpackPlugin({
      template: path.join(paths.SRC, 'index.html'),
      minify: {
        collapseWhitespace: true
      }
    }),
    extractSass
  ],
  module: {
    rules: [
      // Babel loader
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      // Loader for SCSS/CSS files
      {
        test: /\.scss$/,
        use: extractSass.extract({
          use: [{
              loader: 'css-loader',
              options: {
                sourceMap: true,
                minimize: {
                  autoprefixer: {
                    add: true,
                    remove: true,
                    browsers: ['last 2 versions'],
                  },
                  discardComments: {
                    removeAll : true,
                  },
                  discardUnused: false,
                  mergeIdents: false,
                  reduceIdents: false,
                  safe: true,
                  sourcemap: true,
                }
              }
            }, {
              loader: 'sass-loader',
              options: {
                sourceMap: true,
                includePaths: [paths.SCSS]
              }
          }],
          fallback: 'style-loader'
        })
      },
      // URL loader
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  }
};

module.exports = config;
