const webpack = require('webpack')
const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const Dotenv = require('dotenv-webpack')

module.exports = () => {
  const plugins = [
    new Dotenv({
      path: process.env.NODE_ENV == 'production' ? '.env' : `.env.${process.env.NODE_ENV}`,
      allowEmptyValues: true,
      silent: false,
    }),
    new webpack.ProvidePlugin({
      node_env: process.env.NODE_ENV,
    }),
  ]

  return {
    entry: [path.join(__dirname, 'src/index.ts')],
    target: 'web',
    mode: 'production',
    optimization: { minimize: true },
    performance: {
      hints: false,
    },
    plugins,
    output: {
      libraryTarget: 'commonjs2',
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
    },
    resolve: {
      fallback: { os: false, path: false, fs: false },
      extensions: ['.mjs', '.ts', '.js'],
      plugins: [new TsconfigPathsPlugin({})],
    },
    module: {
      rules: [
        {
          test: /\.js|\.ts$/,
          exclude: /node_modules/,
          loader: 'esbuild-loader',
          options: {
            loader: 'ts',
            target: 'node18',
          },
        },
      ],
    },
  }
}
