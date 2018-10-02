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
      }
    },
  },
  chainWebpack: config => {
    config.plugin('provide').use(require('webpack/lib/ProvidePlugin'), ProvidePluginOptions)
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://wxxldev.gyxr.cn/eff/v1/',
        // target: 'http://api.zhuishushenqi.com/',
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
