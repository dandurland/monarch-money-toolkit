const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const createStyledComponentsTransformer = require('typescript-plugin-styled-components').default;
const styledComponentsTransformer = createStyledComponentsTransformer({
  "componentIdPrefix": "mmtk"
});

const BUILD_ROOT = './dist';
const BUILD_PATH = `${BUILD_ROOT}/extension`;
const CODE_SOURCE_DIR = './src';

module.exports = function (env) {
  const validBuildTypes = ['beta', 'development', 'production'];
  if (!env || !validBuildTypes.includes(env.buildType)) {
    console.log(`Invalid --env.buildType provided. Must be one of: [${validBuildTypes.join('|')}]`);
    process.exit(1);
  }

  const config = {
    mode: 'none',

    entry: {
      'background/service-worker': path.resolve(`${CODE_SOURCE_DIR}/extension/background/index.js`),
      'options/options': path.resolve(`${CODE_SOURCE_DIR}/extension/options/index.tsx`),
      'popup/popup': path.resolve(`${CODE_SOURCE_DIR}/extension/popup/index.tsx`),
      'content-scripts/extension-bridge': path.resolve(
        `${CODE_SOURCE_DIR}/extension/content-scripts/extension-bridge.js`
      ),
      'web-accessibles/mm-toolkit': path.resolve(`${CODE_SOURCE_DIR}/extension/toolkit/index.js`),
    },

    devtool: env.buildType !== 'production' ? 'inline-source-map' : false,

    output: {
      path: path.join(__dirname, BUILD_ROOT),
      filename: 'extension/[name].js',
    },

    resolve: {
      alias: {
        toolkit: path.resolve(__dirname, CODE_SOURCE_DIR),
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      modules: ['node_modules'],
    },

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          include: [path.resolve(__dirname, CODE_SOURCE_DIR)],
          use: [
            {
              loader: 'ts-loader',
              options: {
 
                getCustomTransformers: () => ({ before: [styledComponentsTransformer] })
              }
            },
          ],
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          include: [path.resolve(__dirname, CODE_SOURCE_DIR)],
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true
              },
            },
          ],
        },
        {
          oneOf: [
            {
              resourceQuery: /raw/,
              type: 'asset/source',
            },
            {
              test: /\.scss$/,
              use: ['style-loader', 'css-loader', 'sass-loader'],
            },
          ]
        },
        {
          test: /\.css$/,
          resourceQuery: { not: [/raw/] },
          include: [path.resolve(__dirname, CODE_SOURCE_DIR)],
          use: [
            {
              loader: 'css-loader',
              options: {
                esModule: true,
              },
            },
          ],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: 'svg-url-loader',
              options: {
                limit: 10000,
              },
            },
          ],
        },
      ],
    },

    plugins: [
      new webpack.ProgressPlugin(),
      new ForkTsCheckerWebpackPlugin(),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(env.buildType),
      }),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(__dirname, `${CODE_SOURCE_DIR}/manifest.json`),
            to: path.join(__dirname, `${BUILD_PATH}`),
          },
          {
            from: path.join(__dirname, `${CODE_SOURCE_DIR}/extension/background`),
            to: path.join(__dirname, `${BUILD_PATH}/background`),
            globOptions: { ignore: '**/*.js' },
          },
          {
            from: path.join(__dirname, `${CODE_SOURCE_DIR}/extension/options`),
            to: path.join(__dirname, `${BUILD_PATH}/options`),
            globOptions: { ignore: '**/*.{js,jsx,ts,tsx}' },
          },
          {
            from: path.join(__dirname, `${CODE_SOURCE_DIR}/extension/popup`),
            to: path.join(__dirname, `${BUILD_PATH}/popup`),
            globOptions: { ignore: '**/*.{js,jsx,ts,tsx}' },
          },
        ],
      }),
    ],
  };

  return config;
};