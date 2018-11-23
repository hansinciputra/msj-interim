const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
    entry: ['./src/interim.js','@babel/polyfill'],
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: "bundle.js"
       
    },
    devServer:{
        index: 'interim.html',
        contentBase: path.resolve(__dirname,'dist')
    },
    module: {
        rules:[
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: '/node_modules'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin ({
            template: './src/interim.html',
            filename: 'interim.html'
        })
    ]
};