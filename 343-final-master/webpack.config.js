const path = require("path");
const webpack = require("webpack");

const SRC_DIR = path.join(__dirname, "src");
const DIST_DIR = path.join(__dirname, "public");

module.exports = {
    devtool: "source-map",
    entry: [
        "webpack-dev-server/client?http://localhost:3000",
        "webpack/hot/only-dev-server",
        path.join(SRC_DIR, "js/index.jsx")
    ],
    output: {
        path: DIST_DIR,
        filename: "bundle.js",
        publicPath: "/public/"
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ["react-hot", "babel"],
                include: path.join(SRC_DIR) 
            },
            {
                test: /\.scss$/,
                loaders: ["style-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            }
        ]
    }
}
