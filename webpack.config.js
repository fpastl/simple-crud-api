const path = require('path');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  entry: {
    main: path.resolve(__dirname, './server.js'),
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'api.bundle.js',
  },
  target: 'node',
  externals: [nodeExternals()],
};