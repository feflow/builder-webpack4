"use strict";

import express from "express";
import webpack from "webpack";
import webpackDevMiddleware from "webpack-dev-middleware";
import webpackHotMiddleware from "webpack-hot-middleware";
import portfinder from 'portfinder';
import Config from "./config";
import { postMessage, BuilderType } from "./util";

const builderOptions = Config.getBuildConfig();

const app = express();
export interface BuilderOptions {
  [propName: string]: any;
}

export default (devConfig: BuilderOptions) => {
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
  portfinder.basePort = devConfig.devServer.port
  portfinder.getPortPromise()
    .then(newPort => {
      if (devConfig.devServer.port !== newPort) {
        console.log(`${devConfig.devServer.port}端口被占用，开启新端口${newPort}`)
      }
      app.listen(newPort, function (_, err) {
        if (err) {
          console.error(err);
          postMessage.error(BuilderType.dev, {err});
        }
        else {
          postMessage.success(BuilderType.dev,{port:newPort});
          console.log("Webpack server listening on port " + newPort + "\n" +
            ("Open http://127.0.0.1:" + newPort + " to checkout"));
        }
      });
    });
};