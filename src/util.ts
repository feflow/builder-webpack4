'use strict';

import fs from 'fs';
import path from 'path';
import loaderUtils from 'loader-utils';


export enum BuilderType {
    dev = "dev",
    build = "build"
}

/**
 * 深拷贝, Object.assign()只有第一层是深拷贝, 第二层之后仍然是 浅拷贝
 * @param source
 * @returns {{}}
 */
export interface DeepCopyData {
    [propName: string]: any;
}
export const deepCopy = (source: DeepCopyData): DeepCopyData => {
    const ret = {};

    for (let k in source) {
        ret[k] = typeof source[k] ==='object' ? deepCopy(source[k]) : source[k]
    }
    return ret;
};

/**
 * 列出某个目录下的子目录, DFS算法
 * @param root         目录路径
 * @param level        列出的子目录层级
 * @param directories  默认为[]
 * @returns {*|Array}
 */
export const listDir = (root: string, level: number, directories: Array<any>): Array<any> => {
    directories = directories || [];

    if (!fs.existsSync(root)) {
        return directories;
    }

    if (fs.statSync(root).isDirectory() && level > 0) {
        fs.readdirSync(root)
            .forEach((name) => {
                const dirPath = path.join(root, name);
                if (fs.statSync(dirPath).isDirectory()) {
                    directories.push({
                        name,
                        dirPath
                    });
                    listDir(dirPath, level - 1, directories);
                }
            })
    }

    return directories;
};

/**
 * Merge 2个对象
 * @param obj1   Object
 * @param obj2   Object
 */
export const merge = (obj1: object, obj2: object) => {
    return Object.assign({}, obj1, obj2);
};

const hasOwnProperty = Object.prototype.hasOwnProperty;

export const isEmpty = (obj: any): boolean => {
    if (obj == null) return true;
    if (obj.length > 0) return false;
    if (obj.length === 0) return true;

    if (typeof obj !== "object") return true;

    for (let key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
};

interface Context {
    resourcePath: string,
    rootContext: string,
}

/**
 * 用于css-loader转换类名：
 * 1.去除样式文件名的'.module'前缀；
 * 2.遇到以'index.module.xxx'命名的样式文件使用文件夹名代替文件名来组成转换后的类名。
 * 此方法基于'react-dev-utils/getCSSModuleLocalIdent'，增加less正则匹配（https://www.npmjs.com/package/react-dev-utils）
 * @param context webpack传给css-loader的context对象
 * @param localIdentName css-loader的options.localIdentName，没传默认是'[hash:base64]'，这里用不到
 * @param localName 原始css类名
 * @param options css-loader中三个配置项的组合，长这样：
   {
      regExp: options.localIdentRegExp,
      hashPrefix: options.hashPrefix || '',
      context: options.context,
   }
 */
export const getCSSModulesLocalIdent = (
    context: Context,
    localIdentName: string,
    localName: string,
    options: object
) => {
    // Use the filename or folder name, based on some uses the index.js / index.module.(css|scss|sass) project style
    const fileNameOrFolder = context.resourcePath.match(
        /index\.module\.(css|scss|sass|less)$/ // 此处增加less，其余和原函数一致
    )
        ? '[folder]'
        : '[name]';
    // Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.
    const hash = loaderUtils.getHashDigest(
        path.posix.relative(context.rootContext, context.resourcePath) + localName,
        'md5',
        'base64',
        5
    );
    // Use loaderUtils to find the file or folder name
    const className = loaderUtils.interpolateName(
        context,
        fileNameOrFolder + '_' + localName + '__' + hash,
        options
    );

    // remove the .module that appears in every classname when based on the file.
    return className.replace('.module_', '_');
};

/**
 * 增加builder作为子进程时的通信能力
 * 目前有四条指令，分别对应build和dev时构建成功和失败的场景
 * 
 */
export const postMessage = {
    send(channel: BuilderType, data) {
        process && process.send && process.send(JSON.stringify({ type: channel, data }));
    },
    error(type: BuilderType, msg?: any) {
        this.send(`feflow:builder:${type}:error`, msg)
    },
    success(type: BuilderType, msg?: any) {
        this.send(`feflow:builder:${type}:success`, msg)
    }
}