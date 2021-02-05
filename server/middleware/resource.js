// 资源中间件
module.exports = options => {
    return async (req, res, next) => {
        //inflection处理单复数转换、单词格式转换
        const modelName = require('inflection').classify(req.params.resource);
        // 给请求对象上挂载属性model
        // console.log(modelName);
        req.Model = require(`../models/${modelName}`);
        next();
    };
}
