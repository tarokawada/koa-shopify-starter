const {NODE_ENV} = process.env;

module.exports = {
  mode: NODE_ENV === 'production' ? NODE_ENV : 'development',
  // the place webpack will start when building your bundles
  entry: ['./client/index.js'],
  // sets up rules for any special importers
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" }
        ]
      }
    ],
  },
  // file extensions for webpack to look at
  resolve: {
    extensions: ['*','.mjs', '.js', '.jsx'],
  },
  // where webpack will output your finished bundle
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js',
  },
};
