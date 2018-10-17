const path = require('path');
const isProduction = process.env.NODE_ENV !== 'production';
const ProvidePluginOptions = [{
  _ : 'lodash'
}]

module.exports = {
  css: {
    extract: true,
    sourceMap: true,
  },
  // 部署应用时的基本 URL
  baseUrl: isProduction
    ? '/'
    : '/',
  outputDir: 'dist',

  // assetsDir: '/',
  runtimeCompiler: true,

  productionSourceMap: isProduction,
  parallel: false,
  lintOnSave: isProduction,
  configureWebpack: {
    resolve: {
      alias: {
        components: path.resolve(__dirname, './src/components'),
        utils: path.resolve(__dirname, './src/utils'),
        store: path.resolve(__dirname, './src/store'),
      }
    },
  },
  chainWebpack: config => {
    config.plugin('provide').use(require('webpack/lib/ProvidePlugin'), ProvidePluginOptions)
  },
  // 同时需要把 .env.development 文件中的环境变量 修改为 /api
  devServer: {
    proxy: {
      '/api': {
        target: 'http://wxxldev.gyxr.cn/eff/v1/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
// eslint-disable-next-line no-console
// console.info(process.env);
