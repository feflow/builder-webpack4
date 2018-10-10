const Mocha = require('mocha');
const { exec } = require('child_process');
const path = require('path');
const webpack = require('webpack');
const glob = require('glob-all');
const rimraf = require('rimraf');

const startTest = function() {
    const mocha = new Mocha({
        timeout: '10000ms',
    });

    process.chdir(__dirname); // 切换到当前template-project，否则找不到feflow.json
    const builder = require('../../lib/index');
    let prodConfig = builder.prodConfig;
    // 修改loader的解析路径，因为没有在travis-ci全局安装feflow，所以需要加入本地路径
    prodConfig.resolveLoader.modules = [
        'node_modules',
        path.resolve(__dirname, '../../node_modules'),
    ];

    // 清除public目录
    rimraf('./public', () => {
        webpack(prodConfig, (err, stats) => {
            if (err) {
                console.error('webpack配置错误');
                console.error(err.stack || err);
                if (err.details) {
                    console.error(err.details);
                }
                return;
            }
            // 输出一些时间和体积大小信息用于比较性能
            console.log(stats.toString({
                colors: true,
                modules: false,
                children: false, // if you are using ts-loader, setting this to true will make typescript errors show up during build
                chunks: false,
                chunkModules: false
            }));
            console.log('\n' + 'webpack compilation completed. Now start mocha test')
            glob('./test.js', (err, matches) => {
                testFile = matches[0];
                mocha.addFile(testFile);
                mocha.run();
            });
        });
    });
};

startTest();

// exec("npm install -D", (error, stdout, stderr) => {
//   if (error) {
//     console.error(`exec error: ${error}`);
//     return;
//   }
//   console.log(`模板项目依赖安装情况: ${stdout}`);
//   console.log(`模板项目依赖安装提示: ${stderr}`);

// });
