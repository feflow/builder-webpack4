'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
exports.deepCopy = function (source) {
    var ret = {};
    for (var k in source) {
        ret[k] = typeof source[k] === 'object' ? exports.deepCopy(source[k]) : source[k];
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
exports.listDir = function (root, level, directories) {
    directories = directories || [];
    if (!fs_1.default.existsSync(root)) {
        return directories;
    }
    if (fs_1.default.statSync(root).isDirectory() && level > 0) {
        fs_1.default.readdirSync(root)
            .forEach(function (name) {
            var dirPath = path_1.default.join(root, name);
            if (fs_1.default.statSync(dirPath).isDirectory()) {
                directories.push({
                    name: name,
                    dirPath: dirPath
                });
                exports.listDir(dirPath, level - 1, directories);
            }
        });
    }
    return directories;
};
/**
 * Merge 2个对象
 * @param obj1   Object
 * @param obj2   Object
 */
exports.merge = function (obj1, obj2) {
    return Object.assign({}, obj1, obj2);
};
var hasOwnProperty = Object.prototype.hasOwnProperty;
exports.isEmpty = function (obj) {
    if (obj == null)
        return true;
    if (obj.length > 0)
        return false;
    if (obj.length === 0)
        return true;
    if (typeof obj !== "object")
        return true;
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key))
            return false;
    }
    return true;
};
