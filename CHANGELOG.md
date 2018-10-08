<a name="0.4.5"></a>
## [0.4.5](https://github.com/iv-web/builder-webpack/compare/v0.4.4...v0.4.5) (2018-09-03)


### Bug Fixes

* node_modules里面的内容不编译. ([b50f7b5](https://github.com/iv-web/builder-webpack/commit/b50f7b5))



<a name="0.4.4"></a>
## [0.4.4](https://github.com/iv-web/builder-webpack/compare/v0.4.3-alpha.0...v0.4.4) (2018-08-24)


### Features

* 增加less支持. ([23f633a](https://github.com/iv-web/builder-webpack/commit/23f633a))
* 增加tree shaking特性. ([111579f](https://github.com/iv-web/builder-webpack/commit/111579f))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/iv-web/builder-webpack/compare/v0.4.3-alpha.0...v0.4.3) (2018-08-23)


### Features

* 增加less支持. ([23f633a](https://github.com/iv-web/builder-webpack/commit/23f633a))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/iv-web/builder-webpack/compare/v0.3.36...v0.4.0) (2018-08-21)


### Bug Fixes

* 修改注释，去除不必要依赖 ([d5d8c9f](https://github.com/iv-web/builder-webpack/commit/d5d8c9f))
* 开放builder-webpack-core版本 ([08457bf](https://github.com/iv-web/builder-webpack/commit/08457bf))

### Features

* 兼容原来的代理配置，去除不必要的依赖库 ([c0b752f](https://github.com/iv-web/builder-webpack/commit/c0b752f))
* 支持热更新，开发环境使用publicPath方便配代理 ([873a038](https://github.com/iv-web/builder-webpack/commit/873a038))


<a name="0.3.34"></a>
## [0.3.34](https://github.com/iv-web/builder-webpack/compare/v0.3.33...v0.3.34) (2018-07-04)


### Bug Fixes

* feflow.js导致的路径问题修复. ([042ff66](https://github.com/iv-web/builder-webpack/commit/042ff66))



<a name="0.3.33"></a>
## [0.3.33](https://github.com/iv-web/builder-webpack/compare/v0.3.32...v0.3.33) (2018-07-04)


### Bug Fixes

* 雪碧图修复. ([e4d7537](https://github.com/iv-web/builder-webpack/commit/e4d7537))



<a name="0.3.32"></a>
## [0.3.32](https://github.com/iv-web/builder-webpack/compare/v0.3.31...v0.3.32) (2018-07-04)


### Features

* 支持feflow.js配置文件. ([9e94898](https://github.com/iv-web/builder-webpack/commit/9e94898))



<a name="0.3.21"></a>
## [0.3.21](https://github.com/iv-web/builder-webpack/compare/v0.3.18...v0.3.21) (2018-06-20)


### Bug Fixes

* 雪碧图bug修复. ([ed78054](https://github.com/iv-web/builder-webpack/commit/ed78054))


### Features

* 增加对TS语法的支持。 ([4e0dae7](https://github.com/iv-web/builder-webpack/commit/4e0dae7))



<a name="0.3.18"></a>
## [0.3.18](https://github.com/iv-web/builder-webpack/compare/v0.3.17...v0.3.18) (2018-05-17)


### Features

* code split, 抽离出公共js文件 ([9b577af](https://github.com/iv-web/builder-webpack/commit/9b577af))



<a name="0.3.16"></a>
## [0.3.16](https://github.com/iv-web/builder-webpack/compare/v0.3.15...v0.3.16) (2018-05-10)


### Features

* 支持官网场景. ([dd641fc](https://github.com/iv-web/builder-webpack/commit/dd641fc))



<a name="0.3.15"></a>
## [0.3.15](https://github.com/iv-web/builder-webpack/compare/v0.3.14...v0.3.15) (2018-05-09)


### Features

* 支持不传入bizName, 使用于 now.qq.com/index.html 官网的场景. ([93f932d](https://github.com/iv-web/builder-webpack/commit/93f932d))



<a name="0.3.14"></a>
## [0.3.14](https://github.com/iv-web/builder-webpack/compare/v0.3.13...v0.3.14) (2018-04-28)


### Features

* 捷豹部署平台的Loader路径. ([5b99f63](https://github.com/iv-web/builder-webpack/commit/5b99f63))



<a name="0.3.13"></a>
## [0.3.13](https://github.com/iv-web/builder-webpack/compare/v0.3.12...v0.3.13) (2018-04-28)


### Bug Fixes

* 增加对现有版本的兼容. ([2917325](https://github.com/iv-web/builder-webpack/commit/2917325))



<a name="0.3.12"></a>
## [0.3.12](https://github.com/iv-web/builder-webpack/compare/v0.3.10...v0.3.12) (2018-04-27)


### Bug Fixes

* externals去掉http schema的头部. ([cc8d351](https://github.com/iv-web/builder-webpack/commit/cc8d351))
* 增加node-sass依赖。 ([c74bcda](https://github.com/iv-web/builder-webpack/commit/c74bcda))



<a name="0.3.10"></a>
## [0.3.10](https://github.com/iv-web/builder-webpack/compare/v0.3.10-alpha.1...v0.3.10) (2018-04-27)


### Features

* 开发环境默认使用非压缩版本的公用库. ([c0f6190](https://github.com/iv-web/builder-webpack/commit/c0f6190))
* babel相关配置交给开发者，在.babelrc进行配置. ([9b4d130](https://github.com/iv-web/builder-webpack/commit/9b4d130))
* 设置loader的npm包查找的相对路径. ([641d8d6](https://github.com/iv-web/builder-webpack/commit/641d8d6))



<a name="0.3.9"></a>
## [0.3.9](https://github.com/iv-web/builder-webpack/compare/v0.3.8...v0.3.9) (2018-04-23)


### Bug Fixes

* 兼容目前其它的包（依赖babel-preset-es2015） ([7366109](https://github.com/iv-web/builder-webpack/commit/7366109))



<a name="0.3.8"></a>
## [0.3.8](https://github.com/iv-web/builder-webpack/compare/v0.3.7...v0.3.8) (2018-04-20)


### Features

* 使用babel-preset-env替代babel-preset-es2015 ([3a52336](https://github.com/iv-web/builder-webpack/commit/3a52336))
* 支持纯html(没有入口文件)的场景。 ([3d00596](https://github.com/iv-web/builder-webpack/commit/3d00596))



<a name="0.3.7"></a>
## [0.3.7](https://github.com/iv-web/builder-webpack/compare/v0.3.6...v0.3.7) (2018-04-13)


### Bug Fixes

* 打包的cdn和离线包路径修复. ([0e8db39](https://github.com/iv-web/builder-webpack/commit/0e8db39))


### Features

* 开发阶段增加soucemap. ([09fa0f2](https://github.com/iv-web/builder-webpack/commit/09fa0f2))
* 支持域名可配置. ([566dc43](https://github.com/iv-web/builder-webpack/commit/566dc43))



<a name="0.3.7-beta.1"></a>
## [0.3.7-beta.1](https://github.com/iv-web/builder-webpack/compare/v0.3.6...v0.3.7-beta.1) (2018-04-13)


### Features

* 开发阶段增加soucemap. ([09fa0f2](https://github.com/iv-web/builder-webpack/commit/09fa0f2))
* 支持域名可配置. ([566dc43](https://github.com/iv-web/builder-webpack/commit/566dc43))



<a name="0.3.6"></a>
## [0.3.6](https://github.com/iv-web/builder-webpack/compare/v0.3.5...v0.3.6) (2018-04-05)


### Bug Fixes

* 修复PR时import导致的报错. ([a2cf19d](https://github.com/iv-web/builder-webpack/commit/a2cf19d))



<a name="0.3.5"></a>
## [0.3.5](https://github.com/iv-web/builder-webpack/compare/v0.3.4...v0.3.5) (2018-04-04)


### Features

* 增加loader 的可配置选项 ([2b0ddc2](https://github.com/iv-web/builder-webpack/commit/2b0ddc2))



<a name="0.3.4"></a>
## [0.3.4](https://github.com/iv-web/builder-webpack/compare/v0.3.3...v0.3.4) (2018-03-22)


### Bug Fixes

* 去掉离线包里面的script标签上的intergrity属性 ([ad0c5a0](https://github.com/iv-web/builder-webpack/commit/ad0c5a0))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/iv-web/builder-webpack/compare/v0.3.2...v0.3.3) (2018-03-20)


### Features

* 增加process.env.NODE_ENV, 避免线上报warning. ([fcd2f3c](https://github.com/iv-web/builder-webpack/commit/fcd2f3c))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/iv-web/builder-webpack/compare/v0.3.1...v0.3.2) (2018-03-20)


### Bug Fixes

* 离线包的assets去掉url paramter. ([5da0139](https://github.com/iv-web/builder-webpack/commit/5da0139))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/iv-web/builder-webpack/compare/v0.2.19...v0.3.1) (2018-03-20)


### Bug Fixes

* 离线包注入version. ([213860b](https://github.com/iv-web/builder-webpack/commit/213860b))
* 离线包问题解决. ([676b365](https://github.com/iv-web/builder-webpack/commit/676b365))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/iv-web/builder-webpack/compare/v0.2.19...v0.3.0) (2018-03-19)


### Bug Fixes

* 离线包问题解决. ([676b365](https://github.com/iv-web/builder-webpack/commit/676b365))



<a name="0.2.19"></a>
## [0.2.19](https://github.com/iv-web/builder-webpack/compare/v0.2.18...v0.2.19) (2018-03-19)


### Features

* 集成babel-plugin-import. ([a868a1c](https://github.com/iv-web/builder-webpack/commit/a868a1c))



<a name="0.2.18"></a>
## [0.2.18](https://github.com/iv-web/builder-webpack/compare/v0.2.16...v0.2.18) (2018-03-19)


### Bug Fixes

* 修复import语法错误. ([3197be6](https://github.com/iv-web/builder-webpack/commit/3197be6))


### Features

* externals引入的js lib也加上crossorigin. ([553f050](https://github.com/iv-web/builder-webpack/commit/553f050))



<a name="0.2.16"></a>
## [0.2.16](https://github.com/iv-web/builder-webpack/compare/v0.2.15...v0.2.16) (2018-03-19)


### Features

* 给生成的js bundle增加crossorigin头,便于记录错误日志详细堆栈. ([bc7fce5](https://github.com/iv-web/builder-webpack/commit/bc7fce5))



<a name="0.2.15"></a>
## [0.2.15](https://github.com/iv-web/builder-webpack/compare/v0.2.13...v0.2.15) (2018-03-11)


### Bug Fixes

* sytax error. ([04e8d28](https://github.com/iv-web/builder-webpack/commit/04e8d28))


### Features

* alias支持自定义配置. ([a8cca61](https://github.com/iv-web/builder-webpack/commit/a8cca61))
* externals支持配置. ([5915fa7](https://github.com/iv-web/builder-webpack/commit/5915fa7))



<a name="0.2.13"></a>
## [0.2.13](https://github.com/iv-web/builder-webpack/compare/v0.2.12...v0.2.13) (2018-03-09)


### Features

* 支持css后缀的解析规则. ([5878cdd](https://github.com/iv-web/builder-webpack/commit/5878cdd))



<a name="0.2.12"></a>
## [0.2.12](https://github.com/iv-web/builder-webpack/compare/v0.2.11...v0.2.12) (2018-03-09)


### Features

* 增加字体解析规则. ([1c50ca9](https://github.com/iv-web/builder-webpack/commit/1c50ca9))



<a name="0.2.11"></a>
## [0.2.11](https://github.com/iv-web/builder-webpack/compare/v0.2.10...v0.2.11) (2018-03-08)


### Features

* 支持ES7 decorators特性 ([7130086](https://github.com/feflow/builder-webpack3/commit/f12b23e201301fdc61f850ebada5e4ff488b98c2))


<a name="0.2.10"></a>
## [0.2.10](https://github.com/iv-web/builder-webpack/compare/v0.2.9...v0.2.10) (2018-03-08)


### Features

* 支持生产环境inlineCSS配置 ([7130086](https://github.com/feflow/builder-webpack3/commit/88b17806872743ff3558df9cdf0da5435a1fa828))


<a name="0.2.9"></a>
## [0.2.9](https://github.com/iv-web/builder-webpack/compare/v0.2.8...v0.2.9) (2018-01-15)


### Features

* replace-text-loader兼容webpack2.x版本 ([7130086](https://github.com/iv-web/builder-webpack/commit/7130086))
* 集成雪碧图功能. ([4cb899c](https://github.com/iv-web/builder-webpack/commit/4cb899c))



<a name="0.2.8"></a>
## [0.2.8](https://github.com/iv-web/builder-webpack/compare/v0.2.7...v0.2.8) (2018-01-09)


### Bug Fixes

* 修复依赖引入问题. ([72073f4](https://github.com/iv-web/builder-webpack/commit/72073f4))



<a name="0.2.7"></a>
## [0.2.7](https://github.com/iv-web/builder-webpack/compare/v0.2.6...v0.2.7) (2018-01-09)


### Features

* 支持scss文件中资源根据绝对路径方式加载 ([7a4b05e](https://github.com/iv-web/builder-webpack/commit/7a4b05e)), closes [close#4](https://github.com/close/issues/4)



<a name="0.2.6"></a>
## [0.2.6](https://github.com/iv-web/builder-webpack/compare/v0.2.5...v0.2.6) (2017-12-21)


### Bug Fixes

* 清楚public目录bug修复. ([b4a7371](https://github.com/iv-web/builder-webpack/commit/b4a7371))



<a name="0.2.5"></a>
## [0.2.5](https://github.com/iv-web/builder-webpack/compare/v0.2.4...v0.2.5) (2017-12-21)


### Features

* inline html语法支持. ([fa73977](https://github.com/iv-web/builder-webpack/commit/fa73977))



<a name="0.2.4"></a>
## [0.2.4](https://github.com/iv-web/builder-webpack/compare/v0.2.3...v0.2.4) (2017-12-21)


### Features

* 支持fis3的inline语法糖. ([071b392](https://github.com/iv-web/builder-webpack/commit/071b392))



<a name="0.2.3"></a>
## [0.2.3](https://github.com/iv-web/builder-webpack/compare/v0.2.1...v0.2.3) (2017-12-18)


### Bug Fixes

* 打包的静态资源路径问题修复 ([55ad4c1](https://github.com/iv-web/builder-webpack/commit/55ad4c1))


### Features

* 对打包出来的html里面replace掉cdn目录路径 ([db9f88a](https://github.com/iv-web/builder-webpack/commit/db9f88a))



<a name="0.2.1"></a>
## [0.2.1](https://github.com/iv-web/builder-webpack/compare/v0.2.0...v0.2.1) (2017-12-18)


### Bug Fixes

* 修复静态资源的引用问题. ([47dc18b](https://github.com/iv-web/builder-webpack/commit/47dc18b))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/iv-web/builder-webpack/compare/v0.2.0-beta.4...v0.2.0) (2017-12-11)
### Bug Fixes

* clean public folder path ([7822a3a](https://github.com/iv-web/builder-webpack/commit/7822a3a))
* remove loader and plugin dependencies in project. ([da9bafc](https://github.com/iv-web/builder-webpack/commit/da9bafc))
* cli show colors and repair dependencies. ([2e8640d](https://github.com/iv-web/builder-webpack/commit/2e8640d))

### Features

* 集成dev和build命令 ([2baa8ec](https://github.com/iv-web/builder-webpack/commit/2baa8ec))



<a name="0.1.5"></a>
## [0.1.5](https://github.com/iv-web/builder-webpack/compare/v0.1.4...v0.1.5) (2017-12-09)


### Features

* 支持非git项目类型的构建 ([8953557](https://github.com/iv-web/builder-webpack/commit/8953557))



<a name="0.1.4"></a>
## [0.1.4](https://github.com/iv-web/builder-webpack/compare/v0.1.3...v0.1.4) (2017-12-07)


### Features

* 支持css绝对路径的写法 ([a9f2d2b](https://github.com/iv-web/builder-webpack/commit/a9f2d2b))



<a name="0.1.3"></a>
## [0.1.3](https://github.com/iv-web/builder-webpack/compare/56c9b55...v0.1.3) (2017-12-06)


### Bug Fixes

* css解析增加auto prefixer ([ec9cf73](https://github.com/iv-web/builder-webpack/commit/ec9cf73))


### Features

* webpack构建配置 ([56c9b55](https://github.com/iv-web/builder-webpack/commit/56c9b55))
* 基础包通过cdn引入 ([d6763fc](https://github.com/iv-web/builder-webpack/commit/d6763fc))
* 支持绝对路径import语法 ([33ab7c6](https://github.com/iv-web/builder-webpack/commit/33ab7c6))
