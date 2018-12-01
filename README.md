# wxxl

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```

### Some dependencies and plugins
- [axios](https://github.com/axios/axios)
- [echarts](http://echarts.baidu.com/)
- [element-ui](http://element.eleme.io/#/zh-CN/)
- [lodash](https://lodash.com/)
- [moment](http://momentjs.cn/)

### Some illustration
git
refer to: https://git-scm.com/doc

yarn
refer to: https://yarnpkg.com/zh-Hans/

.env.[mode]
refer to: https://cli.vuejs.org/zh/guide/mode-and-env.html

vue.config.js 
refer to: https://cli.vuejs.org/zh/config/

### file directory structure
- node_modules 依赖包
- public 存放 html
- src
  - assets 存放图片等静态资源
  - components 公共组件
  - plugins 插件
  - store 仓库
    - getters store 映射到外部的 getter
    - modules store 模块
  - style 基础样式
  - utils 通用方法
  - views 页面 各个模块页面按照各自的模块划分 其中 api 是该模块请求后端的接口
  - App.vue 容器
  - main.js 主入口
  - router.js 路由 后期会细分
- .env.[mode] 对应于开发与生产的环境变量
- .gitignore git 提交忽略的文件
- babel.config.js babel 转码配置
- package.json 包与命令管理
- README.md 说明文件
- vue.config.js 脚手架配置
- yarn.lock 包含 Yarn 需要锁定整个依赖关系树中所有包的版本的所有内容

IDE: VSCode

IDE Plugins: 
- ESLint Prettier
- Code formatter
- Vetur
- EditorConfig for VS Code
