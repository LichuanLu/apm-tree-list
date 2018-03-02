const path = require('path');
const babelConfig = require('../node_modules/ap-tool/lib/getBabelCommonConfig')('commonjs');
const postCssConfig = require('../node_modules/ap-tool/lib/postcssConfig');

babelConfig.plugins.push([require.resolve('babel-plugin-import'), {
  libraryName: 'antd-mobile',
  libraryDirectory: 'lib',
  //use less will cause error
  style: 'css',
},{
  libraryName: 'antd',
  libraryDirectory: 'lib',
  //use less will cause error
  style: 'css',
}]);


// Export a function. Accept the base config as the only param.
module.exports = (storybookBaseConfig, configType) => {
  // configType has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.

  // Make whatever fine-grained changes you need
  const extendRules = [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      options: babelConfig,
    },
    {
      test: /\.less$/,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'less-loader',
          options: {
            sourceMap: true,
          },
        },
      ],
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
    },
    {
      test: /\.tsx?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options: babelConfig,
        },
        {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
          },
        },
      ],
    },
  ];

  const rules = extendRules.concat(storybookBaseConfig.module.rules);
  storybookBaseConfig.module.rules = rules;

  storybookBaseConfig.resolve = {
    modules: ['node_modules', path.join(__dirname, '../node_modules')],
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.json',
    ],
  };

  // Return the altered config
  return storybookBaseConfig;
};
