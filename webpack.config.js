var path = require('path');

module.exports = {
  entry: './src/client/index.js',
  debug: true,
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js'
  },

  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel',
      query: {
          presets: ["es2015", "react", "stage-0"]
      }
  }, {
      test: /\.scss$/,
      loaders: [
          "style-loader", "css-loader", "sass-loader"
      ]
  }]
  }
};
