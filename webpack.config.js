const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtrackPlugin = require('mini-css-extract-plugin')

module.exports = {
    context: path.resolve(__dirname, 'src'),
    entry: './js/main.js',
    output: {
        filename: 'build.js',
        path: path.resolve(__dirname, 'build'),
        clean: true
    },
    plugins: [
        new HTMLWebpackPlugin({
            title: 'Music Player',
            template: './index.html'
        }),
        new MiniCssExtrackPlugin({
            filename: 'build.css'
        })
    ],
    module:{
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtrackPlugin.loader,'css-loader']
            }
        ]
    }
}