// 登录校验中间件
module.exports = (options) => {
    const jwt = require('jsonwebtoken');
    const assert = require('http-assert');
    const AdminUser = require('../models/AdminUser');
    return async (req, res, next) => {
        // 校验用户是否登录
        const token = String(req.headers.authorization || '')
            .split(' ')
            .pop();
        if (token) {
            jwt.verify(token, req.app.get('secret'), (err, decoded) => {
                if (err) {
                    switch (err.message) {
                        case 'jwt expired':
                            res.status(403).send({
                                message: '无效的token,请重新登录'
                            });
                            break;
                    }
                }
            });
        }
        assert(token, 401, '请提供token');
        const { id } = jwt.verify(token, req.app.get('secret'));
        // console.log(id);
        assert(id, 401, '无效的token');
        req.user = await AdminUser.findById(id);
        assert(req.user, 401, '请先登录');
        await next();
    };
};
