<a name="0.0.18"></a>
## [0.0.18](https://github.com/feflow/builder-webpack4/compare/v0.0.17...v0.0.18) (2019-05-20)


### Bug Fixes

* 修改开发环境样式热更新无效 ([0de4be5](https://github.com/feflow/builder-webpack4/commit/0de4be5))
* 多页构建inline css会inline到所有page ([c3a2761](https://github.com/feflow/builder-webpack4/commit/c3a2761))


### Features

* 开发端口被占用自动检查更新 ([c085ec9](https://github.com/feflow/builder-webpack4/commit/c085ec9))



<a name="0.0.17"></a>
## [0.0.17](https://github.com/feflow/builder-webpack4/compare/v0.0.16...v0.0.17) (2019-05-20)

### Features

* 开发端口被占用自动检查更新 ([98f3e6a](https://github.com/feflow/builder-webpack4/commit/98f3e6a))

<a name="0.0.16"></a>
## [0.0.16](https://github.com/feflow/builder-webpack4/compare/v0.0.15...v0.0.16) (2019-05-20)


### Bug Fixes

* 修复 inline CSS 未压缩的 bug ([9ebd9ef](https://github.com/feflow/builder-webpack4/commit/9ebd9ef))
* 锁住webpack-subresouce版本，避免integrity=null的问题 ([1fe4095](https://github.com/feflow/builder-webpack4/commit/1fe4095))



<a name="0.0.14"></a>
## [0.0.14](https://github.com/feflow/builder-webpack4/compare/v0.0.13...v0.0.14) (2019-04-30)


### Features

* 设置可以禁用SRI ([208cd4b](https://github.com/feflow/builder-webpack4/commit/208cd4b))



<a name="0.0.13"></a>
## [0.0.13](https://github.com/feflow/builder-webpack4/compare/v0.1.12...v0.0.13) (2019-04-24)


### Bug Fixes

* build code ([b91e68f](https://github.com/feflow/builder-webpack4/commit/b91e68f))
* pass test code ([875490f](https://github.com/feflow/builder-webpack4/commit/875490f))
* 设计走查 ([8b8eea9](https://github.com/feflow/builder-webpack4/commit/8b8eea9))
* 调试构建 ([66f50a0](https://github.com/feflow/builder-webpack4/commit/66f50a0))
* 锁住html-webpack-include-assets-plugin的版本号 ([a8c07f5](https://github.com/feflow/builder-webpack4/commit/a8c07f5))


### Features

* add builderOptions param ([d53be19](https://github.com/feflow/builder-webpack4/commit/d53be19))
* change code to ts ([3ad2284](https://github.com/feflow/builder-webpack4/commit/3ad2284))



<a name="0.0.12"></a>
## [0.0.12](https://github.com/iv-web/builder-webpack/compare/v0.0.11...v0.0.12) (2019-03-25)


### Features

* specify babelrc ([7fb8270](https://github.com/iv-web/builder-webpack/commit/7fb8270))
* 支持 Less 热更新 ([3f8ca63](https://github.com/iv-web/builder-webpack/commit/3f8ca63))



<a name="0.0.11"></a>
## [0.0.11](https://github.com/iv-web/builder-webpack/compare/v0.0.10...v0.0.11) (2019-01-25)


### Bug Fixes

* fix webpack subresource integrity version ([e2b795f](https://github.com/iv-web/builder-webpack/commit/e2b795f))



<a name="0.0.9"></a>
## [0.0.9](https://github.com/iv-web/builder-webpack/compare/v0.0.8...v0.0.9) (2019-01-08)


### Bug Fixes

* 使用postcss-loader替代autoprefixer ([f476295](https://github.com/iv-web/builder-webpack/commit/f476295))



<a name="0.0.8"></a>
## [0.0.8](https://github.com/iv-web/builder-webpack/compare/v0.0.6...v0.0.8) (2019-01-08)


### Bug Fixes

* 添加autoprefix-loader ([5843fb5](https://github.com/iv-web/builder-webpack/commit/5843fb5))



<a name="0.0.6"></a>
## [0.0.6](https://github.com/iv-web/builder-webpack/compare/v0.0.4...v0.0.6) (2019-01-04)


### Bug Fixes

* set offline dir configurable ([233db53](https://github.com/iv-web/builder-webpack/commit/233db53))



<a name="0.0.4"></a>
## 0.0.4 (2019-01-04)


### Bug Fixes

* fix prettier配置 ([4b774a0](https://github.com/iv-web/builder-webpack/commit/4b774a0))
* fix robot ([423e774](https://github.com/iv-web/builder-webpack/commit/423e774))
* remove weixin robot ([de1fb78](https://github.com/iv-web/builder-webpack/commit/de1fb78))
* set output path in feflow.json ([86d5d71](https://github.com/iv-web/builder-webpack/commit/86d5d71))
* thread-loader修复 ([7df1cde](https://github.com/iv-web/builder-webpack/commit/7df1cde))
* travis failure ([0ed9bc4](https://github.com/iv-web/builder-webpack/commit/0ed9bc4))
* 优化server显示 ([6a63491](https://github.com/iv-web/builder-webpack/commit/6a63491))
* 使用mini-css-extract-plugin替换extract-text-webpack-plugin ([ff6c8a2](https://github.com/iv-web/builder-webpack/commit/ff6c8a2))
* 修复resolveLoader路径 ([ffd283b](https://github.com/iv-web/builder-webpack/commit/ffd283b))
* 修复webserver路径，去掉console.log ([69eb8eb](https://github.com/iv-web/builder-webpack/commit/69eb8eb))
* 修复脚本 ([2cfe75d](https://github.com/iv-web/builder-webpack/commit/2cfe75d))
* 修复路径查找脚本的问题 ([3473ae7](https://github.com/iv-web/builder-webpack/commit/3473ae7))
* 修改shell ([ff80465](https://github.com/iv-web/builder-webpack/commit/ff80465))
* 修改测试项目的webpack版本到4 ([ccbf05c](https://github.com/iv-web/builder-webpack/commit/ccbf05c))
* 去掉happypack配置，增加target和mode的webpack4配置 ([60de8bd](https://github.com/iv-web/builder-webpack/commit/60de8bd))
* 去掉prefix，改用path设定cdn路径，并且修正webserver路径 ([1f61537](https://github.com/iv-web/builder-webpack/commit/1f61537))
* 去掉Scss解析 ([b4929e3](https://github.com/iv-web/builder-webpack/commit/b4929e3))
* 去除package.json两个替换资源插件 ([9df9527](https://github.com/iv-web/builder-webpack/commit/9df9527))
* 去除多余的依赖 ([81fc22c](https://github.com/iv-web/builder-webpack/commit/81fc22c))
* 开发环境不需要sri插件 ([3a3f0fc](https://github.com/iv-web/builder-webpack/commit/3a3f0fc))
* 更改babel配置路径 ([5409626](https://github.com/iv-web/builder-webpack/commit/5409626))
* 补充fi ([a38cf27](https://github.com/iv-web/builder-webpack/commit/a38cf27))
* 补充prefix，调整目录结构，补充resolve loader查找路径 ([a7c101b](https://github.com/iv-web/builder-webpack/commit/a7c101b))
* 补充依赖中缺少的loader ([1e446d6](https://github.com/iv-web/builder-webpack/commit/1e446d6))
* 设置robot_key环境变量 ([54870b0](https://github.com/iv-web/builder-webpack/commit/54870b0))


### Features

* babel升级到7，去除测试项目对scss的引用 ([edba63a](https://github.com/iv-web/builder-webpack/commit/edba63a))
* travis通知企业微信机器人 ([477f72b](https://github.com/iv-web/builder-webpack/commit/477f72b))
* 使用 html-inline-css-webpack-plugin 代替 html-inline-css-webpack-plugin ([2a96804](https://github.com/iv-web/builder-webpack/commit/2a96804))
* 使用threat-loader替代happypack ([1c212c6](https://github.com/iv-web/builder-webpack/commit/1c212c6))
* 使用threat-loader替换happypack ([ebfe644](https://github.com/iv-web/builder-webpack/commit/ebfe644))
* 使用uglifyjs-webpack-plugin替换webpack内置压缩插件 ([cc795b7](https://github.com/iv-web/builder-webpack/commit/cc795b7))
* 升级 html-webpack-plugin ([11f9c45](https://github.com/iv-web/builder-webpack/commit/11f9c45))
* 升级 webpack-subresource-integrity ([8c1b0cc](https://github.com/iv-web/builder-webpack/commit/8c1b0cc))
* 升级happypack到5.0.0版本 ([e8b2871](https://github.com/iv-web/builder-webpack/commit/e8b2871))
* 升级offline-webpack-plugin ([7bc17ec](https://github.com/iv-web/builder-webpack/commit/7bc17ec))
* 去除builder-core，抽到builder.js ([0b822e8](https://github.com/iv-web/builder-webpack/commit/0b822e8))
* 去除definePLugin ([873dbe8](https://github.com/iv-web/builder-webpack/commit/873dbe8))
* 去除了替换cdn资源的插件，去除了output.filename的前缀，去除了webview preload插件 ([36fa321](https://github.com/iv-web/builder-webpack/commit/36fa321))
* 增加performance提示 ([7b3d1ef](https://github.com/iv-web/builder-webpack/commit/7b3d1ef))
