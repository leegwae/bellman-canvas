const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isDevelopment = process.env.NODE_ENV === 'development';

module.exports = () => {
  const config = {
    devtool: isDevelopment ? 'inline-source-map' : undefined,
    mode: isDevelopment ? 'development' : 'production',
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
              publicPath: './dist/',
            },
          },
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          exclude: /node_modules/,
        },
      ],
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: 'all',
      },
    },
    resolve: {
      extensions: ['.ts', '.js'],
      symlinks: false,
      plugins: [
        new TsConfigPathsPlugin(
          {
            configFile: path.resolve(__dirname, './tsconfig.json'),
          },
        ),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
      }),
      new MiniCssExtractPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './public/'),
            to: path.resolve(__dirname, './dist/'),
          },
        ],
      }),
    ],
  };

  if (isDevelopment) {
    config.devServer = {
      hot: true,
      static: './public',
    };
  }

  return config;
};
