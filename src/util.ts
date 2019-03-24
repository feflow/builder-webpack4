'use strict';

import fs from 'fs';
import path from 'path';

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