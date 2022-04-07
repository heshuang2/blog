// 资源中间件
const jwt = require('jsonwebtoken');
const assert = require('http-assert');
module.exports = (app) => {
    return async (req, res, next) => {
        if (req.params.resource === 'users') {
            console.log(req.body);
            // 创建数据
            const {email,email_code} = req.body;
            // 验证码验证
            const vire = await require('../models/Code').findOne({email,email_code});
            assert(vire,422,'验证码出错')
            console.log(email,email_code);
            if (!req.body.avatar) {
                req.body.avatar = 'http://localhost:3000/uploads/d57e0fc493ac0ae0f84db1c6ed43cb81';
            }
            req.body.locking = true;
            req.body.online = 0;
            req.body.jurisdiction = {
                _id: '600a310b63154d4928858ee0',
                num: '3',
                name: '会员'
            };
            const model = await req.Model.create(req.body);
            console.log(model);
            const content = {
                id: model._id
            };

            const token = jwt.sign(content, app.get('secret'), {});
            res.send({
                status: 200,
                msg: `欢迎您，${model.name}`,
                user: model,
                token
            });
        } else {
            next();
        }
    };
}
