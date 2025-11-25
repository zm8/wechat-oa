const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: {
    entry1: "./src/entry1.js",
    entry2: "./src/entry2.js",
  },
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 0,
    },
  },
  mode: "production", // 设置为生产模式
  plugins: [new CleanWebpackPlugin()],
};
