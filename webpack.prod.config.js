module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js',
    library: 'baixiaobai-web-components-dropdown',
    libraryTarget: 'umd',
  },
  devtool: 'source-map',
};