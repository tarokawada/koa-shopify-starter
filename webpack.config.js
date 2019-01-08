const {NODE_ENV} = process.env;
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== "production";

module.exports = {
  mode: NODE_ENV === "production" ? NODE_ENV : "development",
  entry: ["./client/index.js"],
  plugins: [new MiniCssExtractPlugin({})],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          devMode ? "style-loader" : MiniCssExtractPlugin.loader,
          "css-loader",
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
    ],
  },
  // file extensions for webpack to look at
  resolve: {
    extensions: ["*", ".mjs", ".js", ".jsx"],
  },
  // where webpack will output your finished bundle
  output: {
    path: __dirname + "/dist",
    publicPath: "/",
    filename: "bundle.js",
  },
};
