// var UglifyJSPlugin = require('uglifyjs-webpack-plugin');
// var prod = process.argv.indexOf('--env.production') > -1;

module.exports = {
    devtool: 'source-map',
    entry: __dirname + '/src/app.jsx',
    output: {
        // filename: 'public/' + (prod ? 'bundle.min.js' : 'bundle.js')
        filename: 'public/bundle.js'
    },
    // plugins: prod ? [
    //     new UglifyJSPlugin()
    // ] : [],
    module: {
        loaders: [{
            test: /\.jsx?/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.scss$/,
            loaders: ['style-loader', 'css-loader', 'sass-loader']
        }, {
            test   : /\.(png|jpg|otf|ttf|eot|svg|woff(2))(\?[a-z0-9]+)?$/,
            loader : 'file-loader?name=stylesheets/fonts/[name].[ext]'
        }]
    }
};