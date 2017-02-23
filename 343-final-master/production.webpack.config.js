const path = require("path");
const webpack = require("webpack");

const SRC_DIR = path.join(__dirname, "src");
const DIST_DIR = path.join(__dirname, "public");

module.exports = {
    entry: path.join(SRC_DIR, "js/index.jsx"),
    output: {
        path: DIST_DIR,
        filename: "bundle.js",
        publicPath: "/public/"
    },
    plugins: [
        new webpack.DefinePlugin({
            "process": {
                "env": {
                    "NODE_ENV": JSON.stringify("production")
                }
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loaders: ["babel"],
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
