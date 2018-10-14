const path = require('path');

const projectRoot = path.resolve(__dirname, '../');

const config = {
  cssOptions: {
    modules: true,
    importLoaders: 1,
    localIdentName: '[hash:5]-[local]',
    url: false,
    minimize: true,
  },
};

module.exports = {
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules', projectRoot],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'awesome-typescript-loader',
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader', options: config.cssOptions },
          { loader: 'sass-loader' },
        ],
      },
    ],
  },
};
