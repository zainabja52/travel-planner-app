const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const sass = require('sass');

module.exports = {
  entry: './src/client/js/app.js',
  mode: 'development',
  devtool: 'source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/client/views/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    port: 8081,
    open: true,
    hot: true,
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    ],
    client: {
      overlay: {
        errors: true,
        warnings: false,
      },
    },
  },
  resolve: {
    extensions: ['.js', '.scss'],
    alias: {
      '@client': path.resolve(__dirname, 'src/client'),
    },
  },
};