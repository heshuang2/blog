const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    devServer: {
        proxy: {
            '/api1': {
                target: 'https://autumnfish.cn/', //设置调用的接口域名和端口号
                changeOrigin: true, //true表示实现跨域
                pathRewrite: {
                    '^/api1': '/' //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替baseurl
                }
            },
            '/api2': {
                target: 'http://localhost:3000/web/api', //设置调用的接口域名和端口号
                changeOrigin: true, //true表示实现跨域
                pathRewrite: {
                    '^/api2': '/' //这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替baseurl
                }
            }
        }
    },
    chainWebpack(config) {
        config.plugins.delete('preload');
        config.plugins.delete('prefetch');

        // set svg-sprite-loader
        config.module
            .rule('svg')
            .exclude.add(resolve('src/assets/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/assets/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();
    }
};
