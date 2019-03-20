"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var webpack_1 = __importDefault(require("webpack"));
var webpack_dev_middleware_1 = __importDefault(require("webpack-dev-middleware"));
var webpack_hot_middleware_1 = __importDefault(require("webpack-hot-middleware"));
var config_1 = __importDefault(require("./config"));
var builderOptions = config_1.default.getBuildConfig();
var app = express_1.default();
exports.default = (function (devConfig) {
    // 添加webpack hmr入口，这要求项目中也要安装webpack-hot-middleware，否则webpack找不到该模块
    // TODO: 这里其实可以添加resolve解决
    for (var key in devConfig.entry) {
        if (builderOptions.hot) {
            devConfig.entry[key] = [
                "webpack-hot-middleware/client?dynamicPublicPath=true&path=__webpack_hmr",
                devConfig.entry[key]
            ];
        }
        else {
            devConfig.entry[key] = [
                devConfig.entry[key]
            ];
        }
        // 如果是react-hot-loader 3.0，这一行可以注释
        // devConfig.entry[key].unshift("react-hot-loader/patch");
    }
    var compiler = webpack_1.default(devConfig);
    // 配置devServer
    app.use(webpack_dev_middleware_1.default(compiler, {
        // publicPath: devConfig.output.publicPath, // 默认就会使用devConfig的publicPath
        hot: true,
        color: true,
        stats: "errors-only" // 为了减少webpack不必要的输出，将stats设为errors-only
    }));
    // 加入热更新中间件
    app.use(webpack_hot_middleware_1.default(compiler));
    // Serve the files on port.
    app.listen(devConfig.devServer.port, function (_, err) {
        if (err) {
            console.error(err);
        }
        else {
            console.log("Webpack server listening on port " + devConfig.devServer.port + "\n" +
                ("Open http://127.0.0.1:" + devConfig.devServer.port + " to checkout"));
        }
    });
});
