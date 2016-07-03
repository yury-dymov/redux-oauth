var webpack       = require('webpack');
var path          = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = {
  context: __dirname,
  entry:   [
    './src/index'
  ],
  output:  {
    path:          path.join(__dirname, 'dist'),
    filename:      'bundle.js',
    libraryTarget: 'umd'
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.DefinePlugin({
      __CLIENT__: true,
      __SERVER__: false,
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin()
  ],
  module:  {
    loaders: [
      { include: /\.json$/, loader: 'json' },
      { include: /\.js$/, loader: 'babel', exclude: /node_modules/ }
    ]
  },
  resolve: {
    root: 'src',
    modulesDirectories: [ 'node_modules' ],
    extensions: ['', '.json', '.js']
  }
};


