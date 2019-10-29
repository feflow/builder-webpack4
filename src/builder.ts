/**
 * Copyright (c) 2018 Tencent Inc.
 *
 * Webpack构建器，适用于NOW直播IVWEB团队工程项目.
 *
 * cpselvis <cpselvis@gmal.com>
 */
import path from 'path';
import glob from 'glob';
import webpack from 'webpack';
import fs from 'fs';
import osenv from 'osenv';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import HtmlWebpackExternalsPlugin from 'html-webpack-externals-plugin';
import SriPlugin from 'webpack-subresource-integrity';
import OfflineWebpackPlugin from 'offline-webpack-plugin';
import CleanWebpackPlugin from 'clean-webpack-plugin';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import StringReplaceWebpackPlugin from 'string-replace-webpack-plugin';
import HTMLInlineCSSWebpackPlugin from 'html-inline-css-webpack-plugin';
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin';
import {deepCopy, listDir, merge, isEmpty, getCSSModulesLocalIdent} from './util';
import Config from './config';

// 当前运行的时候的根目录
let projectRoot: string = Config.getPath('feflow.json');

if (!projectRoot) {
    projectRoot = Config.getPath('feflow.js');
}

export interface BaseConfig {
    [propName: string]: any;
}

export interface BuilderOptions {
    outDir: string | object,
    entry: string | object,
    moduleName?: string,
    bizName?: string,
    minifyHTML: boolean,
    minifyCSS?: boolean,
    minifyJS?: boolean,
    inlineCSS: boolean,
    usePx2rem: boolean,
    useSri: boolean,
    "remUnit": number,
    remPrecision: number,
    inject: boolean,
    useTreeShaking?: boolean,
    port?: number,
    hot?: boolean,
    product?: string,
    domain?: string,
    cdn?: string,
    useReact?: boolean,
    externals?: Array<any>,
    runtime?: string,
    alias?: any,
    babelrcPath?: string
}



export interface LoaderObj {
    test?: object,
    use?: object | Array<any>,
    loader?: any,
    options: LoaderObjOptions,
    include?: string,
    exclude?: string
}

export interface LoaderObjOptions{
    [propName: string]: any
}

interface String {
    endsWith(searchString: string, endPosition?: number): boolean;
};

// 最基础的配置
const baseConfig = {
    target: 'web',
    cache: true,
    entry: glob.sync(path.join(projectRoot, './src/pages/*')),
    module: {
        rules: []
    },
    output: '',
    plugins: [],
    resolve: {
        alias: glob.sync(path.join(projectRoot, './src/*/')) // 支持Webpack import绝对路径的写法
    },
    resolveLoader: {},
    // 对体积过大的包进行提示
    performance: {
        hints: 'warning', // enum
        maxAssetSize: 200000, // int (in bytes),
        maxEntrypointSize: 400000, // int (in bytes)
        assetFilter: function (assetFilename: String): boolean {
            // Function predicate that provides asset filenames
            return assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
        }
    }
};

const PATHS = {
    src: path.join(projectRoot, 'src')
};

class Builder {

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
     * @param {String}  options.babelrcPath             指定babelrc配置路径
     *
     * @example
     */
    static createDevConfig(options: BuilderOptions): BaseConfig {
        const devConfig: BaseConfig = deepCopy(baseConfig);
        devConfig.mode = 'development';
        // 设置打包规则
        const devRules: Array<any> = [];
        // 设置HTML解析规则
        devRules.push(this.setHtmlRule());
        // 设置图片解析规则
        devRules.push(this.setImgRule(false));
        // 设置CSS解析规则
        devRules.push(this.setCssRule());
        // 设置使用CSS Modules的CSS解析规则
        devRules.push(this.setCssModulesRule());
        // 设置Less解析规则，开发环境开启css-hot-loader
        devRules.push(this.setLessRule(true, options.usePx2rem, options.remUnit, options.remPrecision));
        // 设置使用CSS Modules的Less解析规则，开发环境开启css-hot-loader
        devRules.push(this.setLessModulesRule(true, options.usePx2rem, options.remUnit, options.remPrecision));
        // 设置JS解析规则
        devRules.push(this.setJsRule(options.babelrcPath));
        // 设置TS解析规则
        devRules.push(this.setTsRule());
        // 设置字体解析规则
        devRules.push(this.setFontRule());

        // 设置打包插件
        let devPlugins: Array<any> = [];
        devPlugins.push(new StringReplaceWebpackPlugin());
        // 设置提取CSS为一个单独的文件的插件
        devPlugins.push(this.setMiniCssExtractPlugin(false, ''));

        if (options.useReact !== false) {
            // React, react-dom 通过cdn引入
            devPlugins.push(this.setExternalPlugin(options.externals));
        }
        // 增加热更新组件
        devPlugins.push(new webpack.HotModuleReplacementPlugin());
        // 抽离公共js
        // devPlugins.push(this.setCommonsChunkPlugin());
        // 多页面打包
        // 开发环境不使用inlineCss，保证css热更新功能

        const {newEntry, htmlWebpackPlugins, cssInlinePlugins} = this.setMultiplePage(devConfig.entry, false, options.inject, false, '', '');
        devPlugins = devPlugins.concat(htmlWebpackPlugins, cssInlinePlugins);

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
    }

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
     * @param {String}  options.babelrcPath             指定babelrc配置路径
     * @example
     */
    static createProdConfig(options: BuilderOptions): BaseConfig {
        const prodConfig: BaseConfig = deepCopy(baseConfig);
        prodConfig.mode = 'production';
        const bizName: string | undefined = options.bizName;
        const moduleName: string | undefined = options.moduleName;
        // 业务域名
        const domain: string = options.domain || 'now.qq.com';
        const cdn: string = options.cdn || '11.url.cn';
        const product: string = options.product || 'now';
        // Html 路径前缀, 打包时的目录
        const htmlPrefix: string = moduleName ? `../../webserver/${bizName}` : '../webserver';
        // Css, Js, Img等静态资源路径前缀, 打包时的目录
        const assetsPrefix: string = moduleName ? `cdn/${bizName}` : 'cdn';
        const cdnUrl: string = moduleName ? `//${cdn}/${product}/${moduleName}/${bizName}` : `//${cdn}/${product}/${bizName}`;
        const serverUrl: string = moduleName ? `//${domain}/${moduleName}/${bizName}` : `//${domain}/${bizName}`;

        // const regex = new RegExp(assetsPrefix + '/', 'g');

        // 设置打包规则
        const prodRules: Array<any> = [];
        // 设置HTML解析规则
        prodRules.push(this.setHtmlRule());
        // 设置图片解析规则, 图片需要hash
        prodRules.push(this.setImgRule(true, ''));
        // 设置CSS解析规则
        prodRules.push(this.setCssRule());
        // 设置开启CSS Modules的CSS解析规则
        prodRules.push(this.setCssModulesRule());
        // 设置Less解析规则，生产环境不开启css-hot-loader
        prodRules.push(this.setLessRule(false, options.usePx2rem, options.remUnit, options.remPrecision));
        // 设置开启CSS Modules的Less解析规则，生产环境不开启css-hot-loader
        prodRules.push(this.setLessModulesRule(false, options.usePx2rem, options.remUnit, options.remPrecision));
        // 设置JS解析规则
        prodRules.push(this.setJsRule(options.babelrcPath));
        // 设置TS解析规则
        prodRules.push(this.setTsRule());
        // 设置字体解析规则
        prodRules.push(this.setFontRule());

        // 设置打包插件
        let prodPlugins: Array<any> = [];
        // 清空Public目录插件, https://github.com/johnagan/clean-webpack-plugin/issues/17
        prodPlugins.push(new CleanWebpackPlugin([options.outDir], {
            root: projectRoot,
            verbose: true,
            dry: false
        }));
        prodPlugins.push(new StringReplaceWebpackPlugin());
        // 设置提取CSS为一个单独的文件的插件
        prodPlugins.push(this.setMiniCssExtractPlugin(true, ''));
        prodPlugins.push(this.setOptimizeCssAssetsPlugin());
        if (options.minifyJS) {
            // 压缩JS
            // webpack4 mode=production 下会默认启动 terser-webpack-plugin
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
        const {newEntry, htmlWebpackPlugins, cssInlinePlugins} = this.setMultiplePage(prodConfig.entry, options.minifyHTML, options.inject, options.inlineCSS, assetsPrefix, htmlPrefix);

        prodPlugins = prodPlugins.concat(htmlWebpackPlugins, cssInlinePlugins);


        if (options.useSri !== false) {
            // 给生成出来的js bundle增加跨域头(cross-origin)，便于错误日志记录
            prodPlugins.push(this.setSriPlugin());
        }

        prodPlugins.push(this.setOffline(assetsPrefix, htmlPrefix, cdnUrl, serverUrl, domain, cdn, product, options.outDir));

        prodConfig.entry = newEntry;
        prodConfig.output = this.setOutput(true, assetsPrefix, cdnUrl + '/', options.outDir);
        prodConfig.module.rules = prodRules;
        prodConfig.plugins = prodPlugins;
        prodConfig.bail = true;
        prodConfig.resolve.alias = this.setAlias(options.alias);
        prodConfig.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
        // 设置 loader 的npm包查找的相对路径，此处设置在全局的 .feflow 目录下
        prodConfig.resolveLoader = this.setResolveLoaderPath(options.runtime);

        return prodConfig;
    }

    /**
     * 设置打包后的输出 output 内容
     * @param useHash               是否开启JS资源hash
     * @param pathPrefix            JS的前缀, 不传入则为空
     * @param publicPath
     * @returns {{filename: string, path: string, publicPath: *}}
     * @private
     */
    static setOutput(useHash: boolean, pathPrefix: string, publicPath: string, outDir: string | object) {
        let hash = '';
        outDir = outDir || 'public';
        if (useHash) {
            hash = '_[chunkhash:8]';
        }

        return {
            filename: `[name]${hash}.js?_bid=152`,
            path: path.join(projectRoot, `${outDir}/${pathPrefix}`),
            publicPath: publicPath,
            crossOriginLoading: 'anonymous'
        };
    }

    /**
     * 设置图片解析规则
     * @param useHash               是否开启图片资源hash
     * @param pathPrefix            图片的前缀，不传入则为空
     * @returns {{test: RegExp, use: {loader: string, options: {name: string}}}}
     * @private
     */
    static setImgRule(useHash: boolean, pathPrefix?: string) {
        let filename = '';
        let hash = '';

        if (pathPrefix) {
            filename = pathPrefix + '/';
        }

        if (useHash) {
            hash = '_[hash:8]';
        }

        return {
            test: /\.(png|svg|jpg|gif|blob)$/,
            use: {
                loader: 'inline-file-loader',
                options: {
                    name: `${filename}img/[name]${hash}.[ext]`
                }
            }
        };
    }

    /**
     * 设置字体解析规则
     */
    static setFontRule() {
        return {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: {
                loader: 'file-loader'
            }
        };
    }

    /**
     * 设置 Html 文件解析规则
     * 支持 Fis3 的 ?inline 语法糖
     *
     * @returns {{test: RegExp, use: Array}}
     * @private
     */
    static setHtmlRule() {
        const htmlRuleArray: Array<any> = [];

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
                        replacement: (source: string): string => {
                            // 找到需要 inline 的包
                            const result = /<script.*?src="(.*?)\?__inline"/gmi.exec(source);
                            const pkg = result && result[1];
                            return "<script>${require('raw-loader!babel-loader!" + pkg + "')}</script>";
                        }
                    }, {
                        // inline html, 匹配<!--inline[/assets/inline/meta.html]-->语法
                        pattern: /<!--inline\[.*?\]-->/gmi,
                        replacement: (source: string): string => {
                            // 找到需要 inline 的包
                            const result = /<!--inline\[(.*?)\]-->/gmi.exec(source);
                            let path = result && result[1];
                            if (path && path[0] === '/') {
                                path = '../..' + path;
                            }

                            return "${require('raw-loader!" + path + "')}";
                        }
                    }
                ]
            }
        });

        return {test: /index\.html$/, use: htmlRuleArray}
    }

    /**
     * 样式文件正则
     */
    static cssRegex = /\.css$/;
    static cssModulesRegex = /\.module\.css$/;
    static lessRegex = /\.less$/;
    static lessModulesRegex = /\.module\.less$/;

    /**
     * 设置CSS解析规则
     */
    static setCssRule() {
        return {
            test: Builder.cssRegex,
            exclude: Builder.cssModulesRegex,
            use: ['style-loader', 'css-loader']
        }
    }

    /**
     * 设置使用CSS Modules的CSS解析规则
     */
    static setCssModulesRule() {
        return {
            test: Builder.cssModulesRegex,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        modules: true,
                        getLocalIdent: getCSSModulesLocalIdent
                    }
                }
            ]
        }
    }

    /**
     * 设置Less文件解析规则
     *
     * @param useHotLoader          是否使用css-hot-loader
     * @param usePx2rem             是否使用px2rem loader
     * @param remUnit               rem单位，默认75
     * @param remPrecision          rem精度, 默认8
     * @returns {{test: RegExp, use: *}}
     * @private
     */
    static setLessRule(useHotLoader: boolean, usePx2rem: boolean, remUnit: number, remPrecision: number) {
        const cssRuleArray: Array<LoaderObj>= [];

        if (useHotLoader) {
            cssRuleArray.push({
                loader: 'css-hot-loader',
                options: {}
            });
        }

        cssRuleArray.push({
            loader: MiniCssExtractPlugin.loader,
            options: {}
        });

        // 加载Css loader, 判断是否开启压缩
        const cssLoaderRule = {
            loader: "css-loader",
            options: {}
        };

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
                plugins: () => [
                    require('autoprefixer')({
                        overrideBrowserslist: ["last 2 version", "> 1%",  "iOS 7"]
                    })
                ]
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
                includePaths: [path.join(projectRoot, "./src")]
            }
        });

        return {
            test: Builder.lessRegex,
            exclude: Builder.lessModulesRegex,
            use: cssRuleArray
        };
    }

    /**
     * 设置使用CSS Modules的Less文件解析规则
     *
     * @param useHotLoader          是否使用css-hot-loader
     * @param usePx2rem             是否使用px2rem loader
     * @param remUnit               rem单位，默认75
     * @param remPrecision          rem精度, 默认8
     * @returns {{test: RegExp, use: *}}
     * @private
     */
    static setLessModulesRule(useHotLoader: boolean, usePx2rem: boolean, remUnit: number, remPrecision: number) {
        const cssRuleArray: Array<LoaderObj>= [];

        if (useHotLoader) {
            cssRuleArray.push({
                loader: 'css-hot-loader',
                options: {}
            });
        }

        cssRuleArray.push({
            loader: MiniCssExtractPlugin.loader,
            options: {}
        });

        // 加载Css loader, 开启Css Modules
        const cssLoaderRule = {
            loader: "css-loader",
            options: {
                modules: true,
                getLocalIdent: getCSSModulesLocalIdent
            }
        };

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
                plugins: () => [
                    require('autoprefixer')({
                        overrideBrowserslist: ["last 2 version", "> 1%",  "iOS 7"]
                    })
                ]
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
                includePaths: [path.join(projectRoot, "./src")]
            }
        });

        return {
            test: Builder.lessModulesRegex,
            use: cssRuleArray
        };
    }

    /**
     * 设置Js文件解析规则, 此处使用happypack,多实例构建
     *
     * @returns {{test: RegExp, loader: string}}
     * @private
     */
    static setJsRule(babelrcPath) {
        return {
            test: /\.jsx?$/, // 支持jsx
            include: path.join(projectRoot, 'src'),
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
                        // babel默认查找根目录下的babel.config.js作为全局配置，除非在此选项强制指定；
                        // 且此选项不会影响加载.babelrc，参考：https://babeljs.io/docs/en/options#configfile
                        configFile: babelrcPath && path.join(process.cwd(), babelrcPath)
                    }
                }
            ]
        };
    }

    /**
     * 设置TS文件解析规则, 此处使用happypack,多实例构建
     *
     * @returns {{test: RegExp, loader: string}}
     * @private
     */
    static setTsRule() {
        return {test: /\.ts(x?)$/, loader: 'happypack/loader', exclude: path.join(projectRoot, 'node_modules')};
    }


    /**
     * 设置提取Css资源的插件
     * @param useHash               是否开启图片资源hash
     * @param pathPrefix            CSS的前缀，不传入则为空
     * @private
     */
    static setMiniCssExtractPlugin(useHash: boolean, pathPrefix: string) {
        let filename = '';
        let hash = '';

        if (pathPrefix) {
            filename = pathPrefix + '/';
        }

        if (useHash) {
            hash = '_[contenthash:8]';
        }

        return new MiniCssExtractPlugin({
            filename: `${filename}[name]${hash}.css`
        });
    }

    static setOptimizeCssAssetsPlugin() {
        return new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        });
    }

    /**
     * 不把React, react-dom打到公共包里，并在html插入cdn资源
     * @private
     */
    static setExternalPlugin(externals) {
        const newExternals = externals || [
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

        return new HtmlWebpackExternalsPlugin({externals: newExternals});
    }

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
    static setMultiplePage(entries: string | object, minifyHtml: boolean, inject: boolean, _inlineCSS: boolean, _assetsPrefix: string, htmlPrefix?: string) {
        const newEntry = {};
        const htmlWebpackPlugins: Array<any> = [];
        const cssInlinePlugins: Array<any> = [];

        Object
            .keys(entries)
            .map((index) => {
                const entry = entries[index];
                /**
                 * TODO: 这个地方会不会太强业务相关了？
                 */
                const entryFile = `${entry}/init.js`;
                // 支持 init.js 文件不是必须存在的场景，纯html
                const isEntryFileExists = fs.existsSync(entryFile);
                const match = entry.match(/\/pages\/(.*)/);
                const pageName = match && match[1];

                let filename = '';
                if (htmlPrefix) {
                    filename = htmlPrefix + '/';
                }

                if (isEntryFileExists) {
                    newEntry[pageName] = entryFile;
                }

                htmlWebpackPlugins.push(new HtmlWebpackPlugin({
                    template: path.join(projectRoot, `src/pages/${pageName}/index.html`),
                    filename: `${filename}${pageName}.html`,
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

                // Inline 生成出来的css
                if (_inlineCSS) {
                    let pageName = path.normalize(entry).split(path.sep).pop();
                    if (pageName) {
                        cssInlinePlugins.push(new HTMLInlineCSSWebpackPlugin({
                            filter(fileName) {
                                let cssFileName = fileName;
                                if (/\.css$/.test(fileName)) {
                                    // file的hash默认是8个，如果另外定义数量请注意修改这里的截取位置（MiniCssExtractPlugin中）
                                    cssFileName = fileName.slice(0, fileName.length - 13);
                                }
                                return (pageName === cssFileName) || new RegExp(`${pageName}\.html$`).test(fileName);
                            }
                        }));
                    }
                }
            });

        return {newEntry, htmlWebpackPlugins, cssInlinePlugins};
    }

    /**
     * 给生成的 js bundle文件增加 SRI 资源校验，防止CDN劫持
     * @returns {SriPlugin}
     * @private
     */
    static setSriPlugin() {
        return new SriPlugin({
            hashFuncNames: ['sha256', 'sha384']
        });
    }

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
    static setOffline(assetsPrefix: string, htmlPrefix: string, _cdnUrl: string, serverUrl: string, domain: string, cdn: string, product: string, outDir: string | object) {
        outDir = outDir || 'public';

        return new OfflineWebpackPlugin({
            path: path.join(projectRoot, `./${outDir}/offline`),
            filename: 'offline.zip',
            pathMapper: (assetPath: string) => {
                if (assetPath.indexOf(htmlPrefix) !== -1) {
                    // 所有资源都改成 now.qq.com 的域名， 防止跨域问题
                    assetPath = assetPath.replace(htmlPrefix, '');
                } else if (assetPath.indexOf(assetsPrefix) !== -1) {
                    assetPath = assetPath.replace(assetsPrefix, '');
                }
                return path.join(serverUrl.replace('//', ''), assetPath);
            },
            beforeAddBuffer(source: string, assetPath: string) {
                if (assetPath.indexOf(htmlPrefix) !== -1) {
                    // 基础包域名修改， 防止跨域问题
                    source = source.replace(/\/\/11\.url\.cn\/now\/([^"'\)\`]+)(["'\`\)])/g, `//${domain}/$1$2`);
                    // 业务资源的域名修改， 防止跨域问题
                    const regex = new RegExp(`//${cdn}/${product}/([^"'\)\`]+)(["'\`\)])`, 'g');
                    source = source.replace(regex, `//${domain}/$1$2`);
                    // 去掉 crossorigin="annoymous"
                    source = source.replace(/crossorigin=\"anonymous\"/g, '');
                    // 去掉 业务 js 文件的 ?_bid=152
                    source = source.replace(/\?_bid=152/g, '');
                    // 去掉业务 js 上的 integrity 属性
                    source = source.replace(/(<script.*)integrity=".*?"/g, '$1');
                    // 注入离线包的版本号. pack
                    const inject = {
                        version: Date.now()
                    };
                    source = source.replace(/(<script)/, '<script>var pack = ' + JSON.stringify(inject) + '</script>$1');
                }

                return source;
            }
        })
    }

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
    static setDevServer(port: number) {
        return {
            contentBase: path.join(projectRoot, './src'),
            inline: true,
            historyApiFallback: false,
            disableHostCheck: true,
            port: port
        };
    }

    /**
     * 设置引用的Alias路径匹配规则，以src下面的目录为根目录
     * TODO: 这个地方是否可以替代css绝对路径的问题
     * 支持import TitleBar from "/modules/components/titlebar" 绝对路径语法
     * @param  alias 用户自定义的alias
     *
     * @private
     */
    static setAlias(alias?: any) {
        const aliasObject = {};

        listDir(path.join(projectRoot, './src'), 1, []).forEach((dir) => {
            const {name, dirPath} = dir;

            aliasObject['/' + name] = dirPath;
            aliasObject[name] = dirPath;
        });

        if (isEmpty(alias)) {
            return aliasObject;
        }

        return merge(alias, aliasObject);
    }

    /**
     * 设置Loader的path查找的目录
     * 目前已把本builder的node_modules也引入
     * 好处是：把构建器放在 ./feflow 目录下，多个项目可以公用一个构建器，便于构建器的增量更新和统一升级
     */
    static setResolveLoaderPath(runtime?: string): object {
        const jbRuntime = runtime || 'runtime-now-6';
        const resolveLoaderPath = path.join(osenv.home(), './.feflow/node_modules');
        // Loader在捷豹平台的查找路径
        const jbLoaderPath = `/data/frontend/install/AlloyDist/${jbRuntime}/node_modules`;

        return {
            modules: [
                path.resolve(__dirname, "../node_modules"),
                resolveLoaderPath,
                jbLoaderPath,
            ]
        };
    }
}

export default Builder;
