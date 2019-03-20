"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var webpack_1 = __importDefault(require("webpack"));
var builder_1 = __importDefault(require("./builder"));
var config_1 = __importDefault(require("./config"));
var server_1 = __importDefault(require("./server"));
var builderOptions = config_1.default.getBuildConfig();
exports.devConfig = builder_1.default.createDevConfig(builderOptions);
exports.prodConfig = builder_1.default.createProdConfig(builderOptions);
function builderWebpack4(cmd) {
    if (cmd === 'dev') {
        server_1.default(exports.devConfig);
    }
    else if (cmd === 'build') {
        webpack_1.default(exports.prodConfig, function (err, stats) {
            if (err)
                console.log(err);
            console.log(stats.toString({
                chunks: false,
                colors: true,
                children: false
            }));
        });
    }
}
exports.default = builderWebpack4;
module.exports = exports.default;
