module.exports = (app) => {
    const express = require('express');
    const resource = require('../../middleware/resource');
    const jwt = require('jsonwebtoken');
    const assert = require('http-assert');
    const authWeb = require('../../middleware/authWeb');
    const messageUser = require('../../middleware/messageUser');
    const userInfo = require('../../middleware/userInfo');
    const removeMessage = require('../../middleware/removeMessage');
    const articleComments = require('../../middleware/articleComments');
    const User = require('../../models/User');
    const router = express.Router({
        // 合并url参数
        mergeParams: true
    });
    // const Articel = require('Articel');
    const Category = require('../../models/Category');

    router.get('/', async (req, res) => {
        let skip = 1,
            limit = 0;
        req.query.skip ? (skip = parseInt(req.query.skip)) : skip;
        req.query.limit ? (limit = parseInt(req.query.limit)) : limit;
        // 创建数据,.populate('parent')关联查询,setOptions()将后面的链式操作转换为对象方式
        if (req.params.resource == 'comments' && req.query.id) {
            const model = await req.Model.find({ 'article._id': req.query.id })
                .sort([['_id', -1]])
                .skip((skip - 1) * limit)
                .limit(limit);
            const count = await req.Model.countDocuments({ 'article._id': req.query.id });
            messageUser(model, User, res, count);
        } else {
            const items = await req.Model.find()
                .sort([['_id', -1]])
                .skip((skip - 1) * limit)
                .limit(limit);
            const count = await req.Model.estimatedDocumentCount();
            if (req.params.resource == 'messages') {
                messageUser(items, User, res, count);
            } else if (req.params.resource == 'comments') {
                articleComments(items, res);
            } else{
                res.send({ count, data: items });
            }
        }
    });
    router.get('/:id', async (req, res) => {
        if (req.params.resource == 'users') {
            const model = await req.Model.findOne({
                account: req.params.id
            });
            res.send(model);
        } else {
            const model = await req.Model.findById(req.params.id);
            res.send(model);
        }
    });
    router.post('/', userInfo(), async (req, res) => {
        // 创建数据
        if (!req.body.avatar) {
            req.body.avatar = 'http://localhost:3000/uploads/5920e9ea2c81ee77c22b5730110c2a7f';
        }
        req.body.jurisdiction = {
            _id: '600a310b63154d4928858ee0',
            num: '3',
            name: '会员'
        };
        const model = await req.Model.create(req.body);
        console.log(model);
        res.send(model);
    });
    // 修改资源接口
    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
        res.send(model);
    });
    // 删除资源接口
    router.delete('/:id/:userId', removeMessage(), async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id, req.body);
        res.send({
            success: true
        });
    });
    app.use('/web/api/rest/:resource', authWeb(), resource(), router);
    // multer定义上传中间件
    const multer = require('multer');
    const upload = multer({
        dest: __dirname + '/../../uploads'
    });
    app.post('/web/api/upload', upload.single('file'), async (req, res) => {
        const file = req.file;
        file.url = `http://localhost:3000/uploads/${file.filename}`;
        res.send(file);
    });
    // 验证注册账号是否重复
    app.post('/web/api/account', async (req, res) => {
        const account = req.body.value;
        // console.log(account);
        const user = await User.findOne({
            account
        });
        if (user) {
            res.send({
                err: true,
                msg: '账号已存在'
            });
        } else {
            res.send({
                err: false,
                msg: ''
            });
        }
    });
    app.post('/web/api/login', async (req, res) => {
        const { account, password } = req.body;
        // console.log(username);
        // 1.根据用户名查找用户
        const user = await User.findOne({
            account
        }).select('+password');
        // 抛出错误异常
        assert(user, 422, '账号不存在');
        // 2.校验密码
        const isvalid = require('bcrypt').compareSync(password, user.password);
        // 抛出错误异常
        assert(isvalid, 422, '密码错误');
        assert(user.locking, 423, '账号已锁定');
        // 3.返回token
        const content = {
            id: user._id
        };
        const model = await User.updateOne({ account }, { online: 0 });
        const updateUser = await User.findOne({
            account
        });

        const token = jwt.sign(content, app.get('secret'), {});
        res.send({
            status: 200,
            msg: `欢迎您，${user.name}`,
            user: updateUser,
            token
        });
    });
    app.post('/web/api/logout', async (req, res) => {
        const model = await User.updateOne({ account: req.body.account }, { online: 1 });
        const updateUser = await User.findOne({
            account: req.body.account
        });
        res.send();
    });
    // 捕获错误异常，进行处理
    app.use(async (err, req, res, next) => {
        res.status(err.status || 500).send({
            message: err.message
        });
    });
};
