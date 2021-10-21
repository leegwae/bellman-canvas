const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'babel-loader',
        include: path.resolve(__dirname, 'src'),
        exclude: /node_modules/,
      },
      {
        test: /\.(glb|gltf)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]?[hash]',
            publicPath: './dist/'
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    symlinks: false,
    plugins: [
      new TsConfigPathsPlugin(
        {
          configFile: path.resolve(__dirname, './tsconfig.json')
        }
      )
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    static: './public',
    hot: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};