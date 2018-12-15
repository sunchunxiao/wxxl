const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: {
        moment: ['moment'],
        lodash: ['lodash'],
    },
    output: {
        path: path.join(__dirname, '/public/build/dll'),
        filename: '[name].js',
        library: '[name]',
    },
    resolve: {
        modules: ['node_modules'],
    },
    mode: 'development',
    plugins: [
        new webpack.DllPlugin({
            name: '[name]',
            path: path.join(__dirname, './public/build/dll/manifest.json'),
            context: path.join(__dirname, './public/build/dll')
        }),
        new webpack.ProvidePlugin({
            moment: 'moment',
            _: 'lodash',
        }),
        //解决moment打包的时候把所有的语言都打包进去的问题
        new webpack.ContextReplacementPlugin(
            /moment[\\/]locale$/,
            /^\.\/(zh-cn)$/
        ),
    ]
};
