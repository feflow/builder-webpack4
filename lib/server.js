"use strict";

const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const Config = require("./config");
const builderOptions = Config.getBuildConfig();

const app = express();

module.exports = devConfig => {
  // 添加webpack hmr入口，这要求项目中也要安装webpack-hot-middleware，否则webpack找不到该模块
  // TODO: 这里其实可以添加resolve解决
  for (var key in devConfig.entry) {
    if (builderOptions.hot) {
      devConfig.entry[key] = [
        `webpack-hot-middleware/client?dynamicPublicPath=true&path=__webpack_hmr`,
        devConfig.entry[key]
      ];
    } else {
      devConfig.entry[key] = [
        devConfig.entry[key]
      ];
    }

    // 如果是react-hot-loader 3.0，这一行可以注释
    // devConfig.entry[key].unshift("react-hot-loader/patch");
  }
  const compiler = webpack(devConfig);

  // 配置devServer
  app.use(
    webpackDevMiddleware(compiler, {
      // publicPath: devConfig.output.publicPath, // 默认就会使用devConfig的publicPath
      hot: true,
      color: true,
      stats: "errors-only" // 为了减少webpack不必要的输出，将stats设为errors-only
    })
  );

  // 加入热更新中间件
  app.use(webpackHotMiddleware(compiler));


  // Serve the files on port.
  app.listen(devConfig.devServer.port, function(res, err) {
    if (err) {
      console.error(err);
    } else {
      console.log(
        `Webpack server listening on port ${devConfig.devServer.port}\n`
      );
    }
  });
};