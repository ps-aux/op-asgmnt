const HtmlWebPackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

const isDev = process.env.WEBPACK_MODE !== 'production'

module.exports = {
  entry: './ui/index.js',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'build/public')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/'
            }
          }
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: './ui/index.html',
      filename: './index.html'
    }),
    new webpack.EnvironmentPlugin({
      API_ROOT: isDev ? process.env.API_ROOT : undefined
    })
  ]
}