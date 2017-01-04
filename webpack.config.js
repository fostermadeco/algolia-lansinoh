'use strict';

const webpack = require('webpack');

module.exports = {
    context: __dirname + '/src',
    entry: {
        app: './js/algoliaAutocomplete.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].bundle.js',
        publicPath: '/assets',
    },
    devServer: {
        contentBase: __dirname + "/src",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{
                    loader: "babel-loader",
                    options: { presets: ["es2015"] }
                }],
            }
        ]
    } 
}