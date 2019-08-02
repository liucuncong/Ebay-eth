const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: "./src/index.html", to: "index.html" },
      { from: "./src/product.html", to: "product.html" },
      { from: "./src/list-item.html", to: "list-item.html" },
    ]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: true },
  devtool: 'source-map',
  module: {
    rules: [
      { test: /\.s?css$/, use: ['style-loader', 'css-loader', 'sass-loader'] },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['env'],
          plugins: ['transform-react-jsx', 'transform-object-rest-spread', 'transform-runtime']
        }
      }
    ]
  }
};
