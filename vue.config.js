const path = require('path');
const webpack = require('webpack');
const isProduction = process.env.NODE_ENV === 'production';
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let plugins = [
    new webpack.DllReferencePlugin({
        context: __dirname,
        manifest: require('./public/build/dll/manifest.json'),
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
];
// !isProduction && plugins.push(new BundleAnalyzerPlugin());

module.exports = {
    css: {
        extract: isProduction,
        sourceMap: true
    },
    // 部署应用时的基本 URL
    baseUrl: isProduction ? '/' : '/',
    outputDir: 'dist',
    runtimeCompiler: true,
    productionSourceMap: false,
    lintOnSave: undefined,
    configureWebpack: {
        resolve: {
            alias: {
                views: path.resolve(__dirname, './src/views'),
                data: path.resolve(__dirname, './src/data'),
                components: path.resolve(__dirname, './src/components'),
                utils: path.resolve(__dirname, './src/utils'),
                store: path.resolve(__dirname, './src/store'),
                plugins: path.resolve(__dirname, './src/plugins'),
            }
        },
        plugins: plugins
    },
    // 暂时保留 chainWebpack 的写法
    // chainWebpack: config => {
    //     config
    //         .plugin('provide')
    //         .use(require('webpack/lib/ProvidePlugin'), ProvidePluginOptions);
    // },
    // 同时需要把 .env.development 文件中的环境变量 修改为 /api
    devServer: {
        port: 8080,//端口号
        host:'',
        open:true,
        historyApiFallback: true,
        // proxy: {
        //     '/api': {
        //         target: 'http://wxxldev.gyxr.cn/eff/v1/',
        //         changeOrigin: true,
        //         ws: true,
        //         pathRewrite: {
        //             '^/api': ''
        //         }
        //     }
        // }
    }
};
