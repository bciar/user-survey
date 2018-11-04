const webpack = require('webpack'),
      path = require('path'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './client/src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Hire Humanly: People Science User Survey',
      template: path.resolve(__dirname, 'client', 'src', 'index.html'),
    }),
    new CleanWebpackPlugin(['dist']),
  ],
  output: {
    path: path.resolve(__dirname, 'client', 'dist'),
    filename: 'index.bundle.js',
  },
  module: {
    rules: [
      {
        test: /(.js$|.jsx$)/,
        exclude: /(node_modules|bower_components)/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
      },
      {
        test: /.(png|jpg|svg|mp4)$/,
        exclude: /node_modules/,
        use: ['url-loader?limit=4192'],
      }
    ]
  }
};
