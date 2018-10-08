'use strict';

/**
 * Copyright (c) 2018 Tencent Inc.
 *
 * Webpack构建器，适用于NOW直播IVWEB团队工程项目.
 *
 * cpselvis <cpselvis@gmal.com>
 */
const path = require('path');
const glob = require("glob");
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const WebviewPreloadWebpackPlugin = require('webview-preload-webpack-plugin');
const StringReplaceWebpackPlugin = require('string-replace-webpack-plugin');
const BuilderCore = require('builder-webpack-core');
const { deepCopy } = require('./util');
const Config = require('./config');

// 当前运行的时候的根目录
let projectRoot = Config.getPath('feflow.json');

if (!projectRoot) {
    projectRoot = Config.getPath('feflow.js');
}

// 最基础的配置
const baseConfig = {
    entry: glob.sync(path.join(projectRoot, './src/pages/*')),
    module: {
        rules: []
    },
    plugins: [],
    resolve: {
        alias: glob.sync(path.join(projectRoot, './src/*/')) // 支持Webpack import绝对路径的写法
    },
    resolveLoader: {}
};

class Builder extends BuilderCore {

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
     *
     * @example
     */
    static createDevConfig(options) {
        const devConfig = deepCopy(baseConfig);

        // 设置打包规则
        const devRules = [];
        // 设置HTML解析规则
        devRules.push(this.setHtmlRule());
        // 设置图片解析规则
        devRules.push(this.setImgRule(false));
        // 设置CSS解析规则
        devRules.push(this.setCssRule());
        // 设置Less解析规则，开发环境不压缩CSS
        devRules.push(this.setLessRule(false, options.usePx2rem, options.remUnit, options.remPrecision));
        // 设置SCSS解析规则，开发环境不压缩CSS
        devRules.push(this.setScssRule(false, options.usePx2rem, options.remUnit, options.remPrecision));
        // 设置JS解析规则
        devRules.push(this.setJsRule());
        // 设置TS解析规则
        devRules.push(this.setTsRule());
        // 设置字体解析规则
        devRules.push(this.setFontRule());

        // 设置打包插件
        let devPlugins = [];
        devPlugins.push(new StringReplaceWebpackPlugin());
        // 设置提取CSS为一个单独的文件的插件
        devPlugins.push(this.setExtractTextPlugin(false, ''));
        
        if (options.useReact !== false) {
            // React, react-dom 通过cdn引入
            devPlugins.push(this.setExternalPlugin(options.externals));
        }
        // 设置NODE_ENV 为 development
        devPlugins.push(this.setDefinePlugin('development'));
        // 多实例构建
        devPlugins.push(this.setHappyPack(options.jsLoader, options.useTreeShaking));
        // 增加热更新组件
        devPlugins.push(new webpack.HotModuleReplacementPlugin());
        // 抽离公共js
        // devPlugins.push(this.setCommonsChunkPlugin());
        // 多页面打包
        
        const {newEntry, htmlWebpackPlugins} = this.setMultiplePage(devConfig.entry, false, options.inject, false, '', '');
        devPlugins = devPlugins.concat(htmlWebpackPlugins);

        devConfig.entry = newEntry;
        // 开发阶段增加sourcemap.
        devConfig.devtool = 'inline-source-map';
        // 这里还是依然按照原来的配置，将静态资源用根目录伺服
        devConfig.output = this.setOutput(false, '', '/');
        devConfig.module.rules = devRules;
        devConfig.plugins = devPlugins;
        devConfig.devServer = this.setDevServer(options.port || 8001);
        devConfig.resolve.alias = this.setAlias(options.alias);
        devConfig.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
        // 设置 loader 的npm包查找的相对路径，此处设置在全局的 .feflow 目录下
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
     * @example
     */
    static createProdConfig(options) {
        const prodConfig = deepCopy(baseConfig);

        const bizName = options.bizName;
        const moduleName = options.moduleName;
        // 业务域名
        const domain = options.domain || 'now.qq.com';
        const cdn = options.cdn || '11.url.cn';
        const product = options.product || 'now';
        // Html 路径前缀, 打包时的目录
        const htmlPrefix = moduleName ? `webserver/${bizName}` : 'webserver';
        // Css, Js, Img等静态资源路径前缀, 打包时的目录
        const assetsPrefix = moduleName ? `cdn/${bizName}` : 'cdn';
        const cdnUrl = moduleName ? `//${cdn}/${product}/${moduleName}/${bizName}` : `//${cdn}/${product}/${bizName}`;
        const serverUrl = moduleName ? `//${domain}/${moduleName}/${bizName}` : `//${domain}/${bizName}`;

        const regex = new RegExp(assetsPrefix + '/', 'g');

        // 设置打包规则
        const prodRules = [];
        // 设置HTML解析规则
        prodRules.push(this.setHtmlRule());
        // 设置图片解析规则, 图片需要hash
        prodRules.push(this.setImgRule(true, assetsPrefix));
        // 设置CSS解析规则
        prodRules.push(this.setCssRule());
        // 设置Less解析规则，生产环境默认压缩CSS
        prodRules.push(this.setLessRule(false, options.usePx2rem, options.remUnit, options.remPrecision));
        // 设置SCSS解析规则，生产环境默认压缩CSS
        prodRules.push(this.setScssRule(options.minifyCSS || true, options.usePx2rem, options.remUnit, options.remPrecision));
        // 设置JS解析规则
        prodRules.push(this.setJsRule());
        // 设置TS解析规则
        prodRules.push(this.setTsRule());
        // 设置字体解析规则
        prodRules.push(this.setFontRule());

        // 设置打包插件
        let prodPlugins = [];
        // 清空Public目录插件, https://github.com/johnagan/clean-webpack-plugin/issues/17
        prodPlugins.push(new CleanWebpackPlugin(['public'], {
            root: projectRoot,
            verbose: true,
            dry: false
        }));
        prodPlugins.push(new StringReplaceWebpackPlugin());
        // 设置提取CSS为一个单独的文件的插件
        prodPlugins.push(this.setExtractTextPlugin(true, assetsPrefix));
        if (options.minifyJS) {
            // 压缩JS
            prodPlugins.push(new webpack.optimize.UglifyJsPlugin());
        }
        if (options.useReact !== false) {
            // React, react-dom 通过cdn引入
            prodPlugins.push(this.setExternalPlugin(options.externals));
        }
        // Inline 生成出来的css
        prodPlugins.push(new HtmlWebpackInlineSourcePlugin());
        // 设置NODE_ENV 为 production
        prodPlugins.push(this.setDefinePlugin('production'));
        // 多实例构建
        prodPlugins.push(this.setHappyPack(options.jsLoader, options.useTreeShaking));
        // 抽离公共js
        //prodPlugins.push(this.setCommonsChunkPlugin());
        // 支持Fis3的 inline 语法糖 多页面打包, 默认压缩html
        const {newEntry, htmlWebpackPlugins} = this.setMultiplePage(prodConfig.entry, options.minifyHTML, options.inject, options.inlineCSS, assetsPrefix, htmlPrefix);

        prodPlugins = prodPlugins.concat(htmlWebpackPlugins);
        // 修复html引用css和js的路径问题
        prodPlugins.push(this.setReplaceHtmlPlugin(regex, ''));
        // 修复js和css中引用的图片路径问题
        prodPlugins.push(this.setReplaceBundlePlugin(regex, ''));
        // 给生成出来的js bundle增加跨域头(cross-origin)，便于错误日志记录
        prodPlugins.push(this.setSriPlugin());
        // Webview预加载插件
        prodPlugins.push(new WebviewPreloadWebpackPlugin({projectpath: projectRoot}));

        prodPlugins.push(this.setOffline(assetsPrefix, htmlPrefix, cdnUrl, serverUrl, domain, cdn, product));

        prodConfig.entry = newEntry;
        prodConfig.output = this.setOutput(true, assetsPrefix, cdnUrl + '/');
        prodConfig.module.rules = prodRules;
        prodConfig.plugins = prodPlugins;
        prodConfig.resolve.alias = this.setAlias(options.alias);
        prodConfig.resolve.extensions = ['.js', '.jsx', '.ts', '.tsx', '.json'];
        // 设置 loader 的npm包查找的相对路径，此处设置在全局的 .feflow 目录下
        prodConfig.resolveLoader = this.setResolveLoaderPath(options.runtime);

        return prodConfig;
    }
}

module.exports = Builder;