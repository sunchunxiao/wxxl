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
            path: 'manifest.json',
            name: '[name]',
            context: __dirname,
        }),
        new webpack.ProvidePlugin({
            moment: 'moment',
            _: 'lodash',
        }),
    ]
};
