// 资源中间件
module.exports = options => {
    return async (req, res, next) => {
        console.log(req.params.id, req.body);
        next();
    };
}
