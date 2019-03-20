"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Copyright (c) 2018 Tencent Inc.
 *
 * Webpack构建器，适用于NOW直播IVWEB团队工程项目.
 *
 * cpselvis <cpselvis@gmal.com>
 */
var path_1 = __importDefault(require("path"));
var glob_1 = __importDefault(require("glob"));
var webpack_1 = __importDefault(require("webpack"));
var fs_1 = __importDefault(require("fs"));
var osenv_1 = __importDefault(require("osenv"));
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
var html_webpack_externals_plugin_1 = __importDefault(require("html-webpack-externals-plugin"));
var webpack_subresource_integrity_1 = __importDefault(require("webpack-subresource-integrity"));
var offline_webpack_plugin_1 = __importDefault(require("offline-webpack-plugin"));
var clean_webpack_plugin_1 = __importDefault(require("clean-webpack-plugin"));
var uglifyjs_webpack_plugin_1 = __importDefault(require("uglifyjs-webpack-plugin"));
var string_replace_webpack_plugin_1 = __importDefault(require("string-replace-webpack-plugin"));
var html_inline_css_webpack_plugin_1 = __importDefault(require("html-inline-css-webpack-plugin"));
var util_1 = require("./util");
var config_1 = __importDefault(require("./config"));
// 当前运行的时候的根目录
var projectRoot = config_1.default.getPath('feflow.json');
if (!projectRoot) {
    projectRoot = config_1.default.getPath('feflow.js');
}
// 最基础的配置
var baseConfig = {
    target: 'web',
    cache: true,
    entry: glob_1.default.sync(path_1.default.join(projectRoot, './src/pages/*')),
    module: {
        rules: []
    },
    output: '',
    plugins: [],
    resolve: {
        alias: glob_1.default.sync(path_1.default.join(projectRoot, './src/*/')) // 支持Webpack import绝对路径的写法
    },
    resolveLoader: {},
    // 对体积过大的包进行提示
    performance: {
        hints: 'warning',
        maxAssetSize: 200000,
        maxEntrypointSize: 400000,
        assetFilter: function (assetFilename) {
            // Function predicate that provides asset filenames
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
        }
    }
};
var Builder = /** @class */ (function () {
    function Builder() {
    }
    /**
     * @function createDevConfig
     * @desc     创建用于开发过程中的webpack打包配置
     *
     * @param {Object}  options                         参数
     * @param {Boolean} options.usePx2rem               是否启用px2rem
     * @param {Number}  options.remUnit                 px2rem的单位, 默认75
     * @param {Number}  options.remPrecision            px2rem的精度，默认8
     * @param {Number}  options.port                    webpack打包的端口号，默认8001
     * @param {String}  options.inject                  是否注入chunks
     * @param {Boolean} options.inlineCSS              是否注入inline打包出来的css
     *
     * @example
     */
    Builder.createDevConfig = function (options) {
        var devConfig = util_1.deepCopy(baseConfig);
        devConfig.mode = 'development';
        // 设置打包规则
        var devRules = [];
        // 设置HTML解析规则
        devRules.push(this.setHtmlRule());
        // 设置图片解析规则
        devRules.push(this.setImgRule(false));
        // 设置CSS解析规则
        devRules.push(this.setCssRule());
        // 设置Less解析规则，开发环境不压缩CSS
        devRules.push(this.setLessRule(false, options.usePx2rem, options.remUnit, options.remPrecision));
        // 设置JS解析规则
        devRules.push(this.setJsRule());
        // 设置TS解析规则
        devRules.push(this.setTsRule());
        // 设置字体解析规则
        devRules.push(this.setFontRule());
        // 设置打包插件
        var devPlugins = [];
        devPlugins.push(new string_replace_webpack_plugin_1.default());
        // 设置提取CSS为一个单独的文件的插件
        devPlugins.push(this.setMiniCssExtractPlugin(false, ''));
        if (options.useReact !== false) {
            // React, react-dom 通过cdn引入
            devPlugins.push(this.setExternalPlugin(options.externals));
        }
        // 增加热更新组件
        devPlugins.push(new webpack_1.default.HotModuleReplacementPlugin());
        // 抽离公共js
        // devPlugins.push(this.setCommonsChunkPlugin());
        // 多页面打包
        var _a = this.setMultiplePage(devConfig.entry, false, options.inject, false, '', ''), newEntry = _a.newEntry, htmlWebpackPlugins = _a.htmlWebpackPlugins;
        devPlugins = devPlugins.concat(htmlWebpackPlugins);
        // Inline 生成出来的css
        if (options.inlineCSS) {
            devPlugins.push(new html_inline_css_webpack_plugin_1.default());
        }
        devConfig.entry = newEntry;
        // 开发阶段增加sourcemap.
        devConfig.devtool = 'inline-source-map';
        // 这里还是依然按照原来的配置，将静态资源用根目录伺服
        devConfig.output = this.setOutput(false, '', '/', options.outDir);
        devConfig.module.rules = devRules;
        devConfig.plugins = devPlugins;
        devConfig.devServer = this.setDevServer(options.port || 8001);
        devConfig.resolve.alias = this.setAlias(options.alias);
        devConfig.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
        // 设置 loader 的npm包查找的相对路径，包括本地node_modules、.feflow、测试环境的node_module
        devConfig.resolveLoader = this.setResolveLoaderPath(options.runtime);
        return devConfig;
    };
    /**
     * @function createProdConfig
     * @desc     创建用于生产环境中的webpack打包配置
     *
     * @param {Object}  options                         参数
     * @param {Boolean} options.minifyHTML              是否压缩HTML
     * @param {Boolean} options.minifyCSS               是否压缩CSS
     * @param {Boolean} options.minifyJS                是否压缩JS
     * @param {Boolean} options.usePx2rem               是否启用px2rem
     * @param {Number}  options.remUnit                 px2rem的单位, 默认75
     * @param {Number}  options.remPrecision            px2rem的精度，默认8
     * @param {String}  options.moduleName              模块名称 (如果不传，则放在根目录)
     * @param {String}  options.bizName                 业务名称
     * @param {String}  options.inject                  是否注入chunks
     * @param {Boolean}  options.inlineCSS              是否注入inline打包出来的css
     * @example
     */
    Builder.createProdConfig = function (options) {
        var prodConfig = util_1.deepCopy(baseConfig);
        prodConfig.mode = 'production';
        var bizName = options.bizName;
        var moduleName = options.moduleName;
        // 业务域名
        var domain = options.domain || 'now.qq.com';
        var cdn = options.cdn || '11.url.cn';
        var product = options.product || 'now';
        // Html 路径前缀, 打包时的目录
        var htmlPrefix = moduleName ? "../../webserver/" + bizName : '../webserver';
        // Css, Js, Img等静态资源路径前缀, 打包时的目录
        var assetsPrefix = moduleName ? "cdn/" + bizName : 'cdn';
        var cdnUrl = moduleName ? "//" + cdn + "/" + product + "/" + moduleName + "/" + bizName : "//" + cdn + "/" + product + "/" + bizName;
        var serverUrl = moduleName ? "//" + domain + "/" + moduleName + "/" + bizName : "//" + domain + "/" + bizName;
        // const regex = new RegExp(assetsPrefix + '/', 'g');
        // 设置打包规则
        var prodRules = [];
        // 设置HTML解析规则
        prodRules.push(this.setHtmlRule());
        // 设置图片解析规则, 图片需要hash
        prodRules.push(this.setImgRule(true, ''));
        // 设置CSS解析规则
        prodRules.push(this.setCssRule());
        // 设置Less解析规则，生产环境默认压缩CSS
        prodRules.push(this.setLessRule(true, options.usePx2rem, options.remUnit, options.remPrecision));
        // 设置JS解析规则
        prodRules.push(this.setJsRule());
        // 设置TS解析规则
        prodRules.push(this.setTsRule());
        // 设置字体解析规则
        prodRules.push(this.setFontRule());
        // 设置打包插件
        var prodPlugins = [];
        // 清空Public目录插件, https://github.com/johnagan/clean-webpack-plugin/issues/17
        prodPlugins.push(new clean_webpack_plugin_1.default([options.outDir], {
            root: projectRoot,
            verbose: true,
            dry: false
        }));
        prodPlugins.push(new string_replace_webpack_plugin_1.default());
        // 设置提取CSS为一个单独的文件的插件
        prodPlugins.push(this.setMiniCssExtractPlugin(true, ''));
        if (options.minifyJS) {
            // 压缩JS
            prodPlugins.push(new uglifyjs_webpack_plugin_1.default({
                uglifyOptions: {
                    warnings: false,
                    parse: {},
                    compress: {},
                    mangle: true,
                    output: null,
                    toplevel: false,
                    nameCache: null,
                    ie8: false,
                    keep_fnames: false
                },
                parallel: true
            }));
        }
        if (options.useReact !== false) {
            // React, react-dom 通过cdn引入
            prodPlugins.push(this.setExternalPlugin(options.externals));
        }
        // 抽离公共js
        /**
         * 这个地方应当支持配置
         */
        //prodPlugins.push(this.setCommonsChunkPlugin());
        // 支持Fis3的 inline 语法糖 多页面打包, 默认压缩html
        var _a = this.setMultiplePage(prodConfig.entry, options.minifyHTML, options.inject, options.inlineCSS, assetsPrefix, htmlPrefix), newEntry = _a.newEntry, htmlWebpackPlugins = _a.htmlWebpackPlugins;
        prodPlugins = prodPlugins.concat(htmlWebpackPlugins);
        // Inline 生成出来的css
        if (options.inlineCSS) {
            prodPlugins.push(new html_inline_css_webpack_plugin_1.default());
        }
        // 给生成出来的js bundle增加跨域头(cross-origin)，便于错误日志记录
        prodPlugins.push(this.setSriPlugin());
        prodPlugins.push(this.setOffline(assetsPrefix, htmlPrefix, cdnUrl, serverUrl, domain, cdn, product, options.outDir));
        prodConfig.entry = newEntry;
        prodConfig.output = this.setOutput(true, assetsPrefix, cdnUrl + '/', options.outDir);
        prodConfig.module.rules = prodRules;
        prodConfig.plugins = prodPlugins;
        prodConfig.resolve.alias = this.setAlias(options.alias);
        prodConfig.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
        // 设置 loader 的npm包查找的相对路径，此处设置在全局的 .feflow 目录下
        prodConfig.resolveLoader = this.setResolveLoaderPath(options.runtime);
        return prodConfig;
    };
    /**
     * 设置打包后的输出 output 内容
     * @param useHash               是否开启JS资源hash
     * @param pathPrefix            JS的前缀, 不传入则为空
     * @param publicPath
     * @returns {{filename: string, path: string, publicPath: *}}
     * @private
     */
    Builder.setOutput = function (useHash, pathPrefix, publicPath, outDir) {
        var hash = '';
        outDir = outDir || 'public';
        if (useHash) {
            hash = '_[chunkhash:8]';
        }
        return {
            filename: "[name]" + hash + ".js?_bid=152",
            path: path_1.default.join(projectRoot, outDir + "/" + pathPrefix),
            publicPath: publicPath,
            crossOriginLoading: 'anonymous'
        };
    };
    /**
     * 设置图片解析规则
     * @param useHash               是否开启图片资源hash
     * @param pathPrefix            图片的前缀，不传入则为空
     * @returns {{test: RegExp, use: {loader: string, options: {name: string}}}}
     * @private
     */
    Builder.setImgRule = function (useHash, pathPrefix) {
        var filename = '';
        var hash = '';
        if (pathPrefix) {
            filename = pathPrefix + '/';
        }
        if (useHash) {
            hash = '_[hash:8]';
        }
        return {
            test: /\.(png|svg|jpg|gif|blob)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: filename + "img/[name]" + hash + ".[ext]"
                }
            }
        };
    };
    /**
     * 设置字体解析规则
     */
    Builder.setFontRule = function () {
        return {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: {
                loader: 'file-loader'
            }
        };
    };
    /**
     * 设置 Html 文件解析规则
     * 支持 Fis3 的 ?inline 语法糖
     *
     * @returns {{test: RegExp, use: Array}}
     * @private
     */
    Builder.setHtmlRule = function () {
        var htmlRuleArray = [];
        htmlRuleArray.push({
            loader: 'html-loader',
            options: {
                // 支持 html `${}` 语法
                interpolate: 1,
                attrs: [':src']
            }
        });
        // Fis3 inline 语法糖支持
        htmlRuleArray.push({
            loader: 'replace-text-loader',
            options: {
                rules: [
                    {
                        // inline script, 匹配所有的<script src="package?__inline"></script> 需要inline的标签
                        // 并且替换为
                        // <script>${require('raw-loader!babel-loader!../../node_modules/@tencent/report
                        // - whitelist')}</script> 语法
                        pattern: /<script.*?src="(.*?)\?__inline".*?>.*?<\/script>/gmi,
                        replacement: function (source) {
                            // 找到需要 inline 的包
                            var result = /<script.*?src="(.*?)\?__inline"/gmi.exec(source);
                            var pkg = result && result[1];
                            return "<script>${require('raw-loader!babel-loader!" + pkg + "')}</script>";
                        }
                    }, {
                        // inline html, 匹配<!--inline[/assets/inline/meta.html]-->语法
                        pattern: /<!--inline\[.*?\]-->/gmi,
                        replacement: function (source) {
                            // 找到需要 inline 的包
                            var result = /<!--inline\[(.*?)\]-->/gmi.exec(source);
                            var path = result && result[1];
                            if (path && path[0] === '/') {
                                path = '../..' + path;
                            }
                            return "${require('raw-loader!" + path + "')}";
                        }
                    }
                ]
            }
        });
        return { test: /index\.html$/, use: htmlRuleArray };
    };
    /**
     * 设置CSS解析规则
     */
    Builder.setCssRule = function () {
        return {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        };
    };
    /**
     * 设置Less文件解析规则
     *
     * @param minimize              是否压缩Css
     * @param usePx2rem             是否使用px2rem loader
     * @param remUnit               rem单位，默认75
     * @param remPrecision          rem精度, 默认8
     * @returns {{test: RegExp, use: *}}
     * @private
     */
    Builder.setLessRule = function (minimize, usePx2rem, remUnit, remPrecision) {
        var cssRuleArray = [];
        cssRuleArray.push({
            loader: mini_css_extract_plugin_1.default.loader,
            options: {}
        });
        // 加载Css loader, 判断是否开启压缩
        var cssLoaderRule = {
            loader: "css-loader",
            options: {}
        };
        if (minimize) {
            cssLoaderRule.options = {
                minimize: true
            };
        }
        else {
            cssLoaderRule.options = {
                alias: this.setAlias()
            };
        }
        cssRuleArray.push(cssLoaderRule);
        // 如果开启px2rem，则加载px2rem-loader
        if (usePx2rem) {
            cssRuleArray.push({
                loader: "px2rem-loader",
                options: {
                    remUnit: remUnit || 75,
                    remPrecision: remPrecision || 8
                }
            });
        }
        // css 前缀，兼容低版本浏览器
        cssRuleArray.push({
            loader: 'postcss-loader',
            options: {
                plugins: function () { return [
                    require('autoprefixer')({
                        browsers: ["last 2 version", "> 1%", "iOS 7"]
                    })
                ]; }
            }
        });
        // 雪碧图loader
        cssRuleArray.push({
            loader: "sprites-loader",
            options: {}
        });
        // 加载解析less的less-loader
        cssRuleArray.push({
            loader: "less-loader",
            options: {
                includePaths: [path_1.default.join(projectRoot, "./src")]
            }
        });
        return {
            test: /\.less$/,
            use: cssRuleArray
        };
    };
    /**
     * 设置Js文件解析规则, 此处使用happypack,多实例构建
     *
     * @returns {{test: RegExp, loader: string}}
     * @private
     */
    Builder.setJsRule = function () {
        return {
            test: /\.jsx?$/,
            include: path_1.default.join(projectRoot, 'src'),
            use: [
                {
                    loader: 'thread-loader',
                    options: {
                        workers: 3
                    }
                },
                {
                    loader: 'babel-loader',
                    options: {
                        configFile: path_1.default.join(process.cwd(), './.babelrc') // 确保使用的是项目根目录的babel配置
                    }
                }
            ]
        };
    };
    /**
     * 设置TS文件解析规则, 此处使用happypack,多实例构建
     *
     * @returns {{test: RegExp, loader: string}}
     * @private
     */
    Builder.setTsRule = function () {
        return { test: /\.ts(x?)$/, loader: 'happypack/loader', exclude: path_1.default.join(projectRoot, 'node_modules') };
    };
    /**
     * 设置提取Css资源的插件
     * @param useHash               是否开启图片资源hash
     * @param pathPrefix            CSS的前缀，不传入则为空
     * @private
     */
    Builder.setMiniCssExtractPlugin = function (useHash, pathPrefix) {
        var filename = '';
        var hash = '';
        if (pathPrefix) {
            filename = pathPrefix + '/';
        }
        if (useHash) {
            hash = '_[contenthash:8]';
        }
        return new mini_css_extract_plugin_1.default({
            filename: filename + "[name]" + hash + ".css"
        });
    };
    /**
     * 不把React, react-dom打到公共包里，并在html插入cdn资源
     * @private
     */
    Builder.setExternalPlugin = function (externals) {
        var newExternals = externals || [
            {
                module: 'react',
                entry: '//11.url.cn/now/lib/16.2.0/react.min.js?_bid=3123',
                global: 'React'
            }, {
                module: 'react-dom',
                entry: '//11.url.cn/now/lib/16.2.0/react-dom.min.js?_bid=3123',
                global: 'ReactDOM'
            }
        ];
        return new html_webpack_externals_plugin_1.default({ externals: newExternals });
    };
    /**
     * 多页面打包
     * @param entries             glob的entry路径
     * @param minifyHtml          是否压缩html
     * @param inject              是否自动注入打包出来的js和css
     * @param inlineCSS           是否inline打包出来的css
     * @param assetsPrefix        Css, Js, img的路径前缀
     * @param htmlPrefix          Html的路径前缀
     * @returns {{newEntry: {}, htmlWebpackPlugins: Array}}
     * @private
     */
    Builder.setMultiplePage = function (entries, minifyHtml, inject, _inlineCSS, _assetsPrefix, htmlPrefix) {
        var newEntry = {};
        var htmlWebpackPlugins = [];
        Object
            .keys(entries)
            .map(function (index) {
            var entry = entries[index];
            /**
             * TODO: 这个地方会不会太强业务相关了？
             */
            var entryFile = entry + "/init.js";
            // 支持 init.js 文件不是必须存在的场景，纯html
            var isEntryFileExists = fs_1.default.existsSync(entryFile);
            var match = entry.match(/\/pages\/(.*)/);
            var pageName = match && match[1];
            var filename = '';
            if (htmlPrefix) {
                filename = htmlPrefix + '/';
            }
            if (isEntryFileExists) {
                newEntry[pageName] = entryFile;
            }
            htmlWebpackPlugins.push(new html_webpack_plugin_1.default({
                template: path_1.default.join(projectRoot, "src/pages/" + pageName + "/index.html"),
                filename: "" + filename + pageName + ".html",
                chunks: [pageName],
                // assetsPrefix: `${assetsPrefix}/`,
                inject: inject && isEntryFileExists,
                minify: minifyHtml
                    ? {
                        html5: true,
                        collapseWhitespace: true,
                        preserveLineBreaks: false,
                        minifyCSS: true,
                        minifyJS: true,
                        removeComments: false
                    }
                    : false
            }));
        });
        return { newEntry: newEntry, htmlWebpackPlugins: htmlWebpackPlugins };
    };
    /**
     * 给生成的 js bundle文件增加 SRI 资源校验，防止CDN劫持
     * @returns {SriPlugin}
     * @private
     */
    Builder.setSriPlugin = function () {
        return new webpack_subresource_integrity_1.default({
            hashFuncNames: ['sha256', 'sha384']
        });
    };
    /**
     * 离线包打包逻辑
     * @param assetsPrefix            CSS、Img、JS等打包路径前缀
     * @param htmlPrefix              Html打包路径前缀
     * @param cdnUrl                  CDN路径
     * @param serverUrl               now.qq.com路径
     * @param domain                  域名
     * @param cdn                     cdn路径
     * @param product                 cdn对应的产品
     * @private
     */
    Builder.setOffline = function (assetsPrefix, htmlPrefix, _cdnUrl, serverUrl, domain, cdn, product, outDir) {
        outDir = outDir || 'public';
        return new offline_webpack_plugin_1.default({
            path: path_1.default.join(projectRoot, "./" + outDir + "/offline"),
            filename: 'offline.zip',
            pathMapper: function (assetPath) {
                if (assetPath.indexOf(htmlPrefix) !== -1) {
                    // 所有资源都改成 now.qq.com 的域名， 防止跨域问题
                    assetPath = assetPath.replace(htmlPrefix, '');
                }
                else if (assetPath.indexOf(assetsPrefix) !== -1) {
                    assetPath = assetPath.replace(assetsPrefix, '');
                }
                return path_1.default.join(serverUrl.replace('//', ''), assetPath);
            },
            beforeAddBuffer: function (source, assetPath) {
                if (assetPath.indexOf(htmlPrefix) !== -1) {
                    // 基础包域名修改， 防止跨域问题
                    source = source.replace(/\/\/11\.url\.cn\/now\/([^"'\)\`]+)(["'\`\)])/g, "//" + domain + "/$1$2");
                    // 业务资源的域名修改， 防止跨域问题
                    var regex = new RegExp("//" + cdn + "/" + product + "/([^\"')`]+)([\"'`)])", 'g');
                    source = source.replace(regex, "//" + domain + "/$1$2");
                    // 去掉 crossorigin="annoymous"
                    source = source.replace(/crossorigin=\"anonymous\"/g, '');
                    // 去掉 业务 js 文件的 ?_bid=152
                    source = source.replace(/\?_bid=152/g, '');
                    // 去掉业务 js 上的 integrity 属性
                    source = source.replace(/(<script.*)integrity=".*?"/, '$1');
                    // 注入离线包的版本号. pack
                    var inject = {
                        version: Date.now()
                    };
                    source = source.replace(/(<script)/, '<script>var pack = ' + JSON.stringify(inject) + '</script>$1');
                }
                return source;
            }
        });
    };
    /**
     * Code split, 提取出公共js文件，避免每个页面重复打包
     */
    // static setCommonsChunkPlugin() {
    //     return new webpack.optimize.CommonsChunkPlugin({
    //         name: 'common'
    //     });
    // }
    /**
     * 设置dev server，WDS配置
     * @param port
     * @returns {{contentBase: string, inline: boolean, historyApiFallback: boolean, disableHostCheck: boolean, port: *}}
     * @private
     */
    Builder.setDevServer = function (port) {
        return {
            contentBase: path_1.default.join(projectRoot, './src'),
            inline: true,
            historyApiFallback: false,
            disableHostCheck: true,
            port: port
        };
    };
    /**
     * 设置引用的Alias路径匹配规则，以src下面的目录为根目录
     * TODO: 这个地方是否可以替代css绝对路径的问题
     * 支持import TitleBar from "/modules/components/titlebar" 绝对路径语法
     * @param  alias 用户自定义的alias
     *
     * @private
     */
    Builder.setAlias = function (alias) {
        var aliasObject = {};
        util_1.listDir(path_1.default.join(projectRoot, './src'), 1, []).forEach(function (dir) {
            var name = dir.name, dirPath = dir.dirPath;
            aliasObject['/' + name] = dirPath;
            aliasObject[name] = dirPath;
        });
        if (util_1.isEmpty(alias)) {
            return aliasObject;
        }
        return util_1.merge(alias, aliasObject);
    };
    /**
     * 设置Loader的path查找的目录
     * 目前已把本builder的node_modules也引入
     * 好处是：把构建器放在 ./feflow 目录下，多个项目可以公用一个构建器，便于构建器的增量更新和统一升级
     */
    Builder.setResolveLoaderPath = function (runtime) {
        var jbRuntime = runtime || 'runtime-now-6';
        var resolveLoaderPath = path_1.default.join(osenv_1.default.home(), './.feflow/node_modules');
        // Loader在捷豹平台的查找路径
        var jbLoaderPath = "/data/frontend/install/AlloyDist/" + jbRuntime + "/node_modules";
        return {
            modules: [
                path_1.default.resolve(__dirname, "../node_modules"),
                resolveLoaderPath,
                jbLoaderPath,
            ]
        };
    };
    return Builder;
}());
exports.default = Builder;
