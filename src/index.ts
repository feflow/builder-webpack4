import webpack from 'webpack';
import Builder from './builder';
import Config from './config';
export interface BaseConfig {
    [propName: string]: any;
}
const builderOptions = Config.getBuildConfig();
export const devConfig: BaseConfig = Builder.createDevConfig(builderOptions);
export const prodConfig: BaseConfig = Builder.createProdConfig(builderOptions);

export default function builderWebpack4 (cmd: string) {
  if (cmd === 'dev') {
    require('./server')(devConfig);
  } else if (cmd === 'build') {
    webpack(prodConfig, (err: any, stats: any) => {
      if (err) console.log(err);
      console.log(stats.toString({
        chunks: false,
        colors: true,
        children: false
      }));
    });
  }
}

