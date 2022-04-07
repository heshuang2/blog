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
    const mail = require('../../middleware/mail');
    const resetPassword = require('../../middleware/resetPassword');
    const createUser = require('../../middleware/createUser')
    const router = express.Router({
        // 合并url参数
        mergeParams: true
    });
    const Category = require('../../models/Category');

    router.get('/', async (req, res) => {
        let skip = 1,
            limit = 0;
        req.query.skip ? (skip = parseInt(req.query.skip)) : skip;
        req.query.limit ? (limit = parseInt(req.query.limit)) : limit;
        // 创建数据,.populate('parent')关联查询,setOptions()将后面的链式操作转换为对象方式
        // 获取相应文章数据
        if (req.params.resource === 'comments' && req.query.id) {
            const model = await req.Model.find({ 'article._id': req.query.id })
                .sort([['_id', -1]])
                .skip((skip - 1) * limit)
                .limit(limit);
            const count = await req.Model.countDocuments({ 'article._id': req.query.id });
            await messageUser(model, User, res, count);
        } else {
            const items = await req.Model.find()
                .sort([['_id', req.params.resource === 'messages' ? -1 : 1]])
                .skip((skip - 1) * limit)
                .limit(limit);
            const count = await req.Model.estimatedDocumentCount();
            if (req.params.resource === 'messages') {
                await messageUser(items, User, res, count);
            } else if (req.params.resource === 'comments') {
                await articleComments(items, res);
            } else{
                res.send({ count, data: items });
            }
        }
    });
    router.get('/:id', async (req, res) => {
        if (req.params.resource === 'users') {
            const model = await req.Model.findOne({
                account: req.params.id
            });
            res.send(model);
        } else {
            const model = await req.Model.findById(req.params.id);
            res.send(model);
        }
    });


    router.post('/', userInfo(), createUser(app), async (req, res) => {
        // 创建数据

        const model = await req.Model.create(req.body);
        console.log(model);

        res.send({
            status: 200,
            data: model
        });
    });
    // 修改资源接口
    router.put('/:id',  async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
        console.log(model);
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
    const mcx = require("multer-cos-x"); // 腾讯云cos存储图片
    const upload = multer({
        storage: mcx({
            cos: {
                // 必填参数
                SecretId: 'AKIDGLAizziAMHvIOEn56rLYU9XeU2JJ2Ugb',
                SecretKey: 'f3A0Zrsd6IEtHOEo7nCKCm57sMZVAYeU',
                Bucket: 'node-blog-1304818575',
                Region: 'ap-shanghai',
                // 可选参数
                domainProtocol: process.env.COS_DOMAIN_PROTOCOL, //自定义域名协议, 不定义则会使用http
                domain: 'node-blog-1304818575.file.myqcloud.com', // 自定义域名, 不定义则会使用cos默认域名
                dir: process.env.COS_DIR, // cos文件路径, 不定义则会上传至bucket的根目录
                onProgress: progressData => {
                    //进度回调函数，回调是一个对象，包含进度信息
                    // console.log(progressData);
                },
            },
        }),
    });
    app.post('/web/api/upload', upload.single('file'), async (req, res) => {
        const file = req.file;
        // file.url = `http://localhost:3000/uploads/${file.filename}`;
        res.send(file);
    });

    // 验证注册账号是否重复
    app.post('/web/api/account', async (req, res) => {
        const {regName, value} = req.body;
        let pattern , user;
        if (regName === 'account') {
            pattern = '账号';
            user = await User.findOne({
                'account': value
            });
        }else if(regName === 'email') {
            pattern = '邮箱';
            user = await User.findOne({
                'email': value
            });
        }
        if (user) {
            res.send({
                err: true,
                msg: `${pattern}已存在`
            });
        } else {
            res.send({
                err: false,
                msg: ''
            });
        }
    });
    // 找回密码验证邮箱是否有注册账号
    app.post('/web/api/email', async (req, res) => {
        const email  = req.body.value;
        console.log(email);
        const user = await User.findOne({
            email
        });
        if (user) {
            res.send({
                err: false,
                data: user._id
            });
        } else {
            res.send({
                err: true,
                msg: `输入的邮箱未注册账号`
            });
        }
    });
    //邮箱验证码验证
    app.post('/web/api/verification', async (req, res) => {
        const {email,email_code} = req.body;
        // 验证码验证
        const valid = await require('../../models/Code').findOne({email,email_code});
        assert(valid,422,'验证码出错');
        res.send({
            status: 200,
            msg: '验证成功'
        });
    })
    app.post('/web/api/login', async (req, res) => {
        const { account, password } = req.body;
        // console.log(username);
        const RegEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;//邮箱校验
        const isEmail = RegEmail.test(account);
        let user;
        // 1.根据用户名查找用户
        if  (isEmail) {
            user = await User.findOne({
                'email': account
            }).select('+password');
        } else {
            user = await User.findOne({
                account
            }).select('+password');
        }
        console.log(user);
        // 抛出错误异常
        assert(user, 422, '账号或密码错误');
        // 2.校验密码
        const isvalid = require('bcryptjs').compareSync(password, user.password);
        // 抛出错误异常
        assert(isvalid, 422, '账号或密码错误');
        assert(user.locking, 423, '账号已锁定');
        // 3.返回token
        const content = {
            id: user._id
        };
        const model = await User.updateOne({ account }, { online: 0 });
        const updateUser = await User.findOne({
            'account': user.account
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
    // 发送邮件验证码
    /**
     * @api {post} 邮箱验证码发送
     * @apiParam {String} mail 邮箱
     *
     */
    app.post('/web/api/getMailCode',mail(),async (req, res, next) => {

        res.status(200).json({message: req.body});
    })
};
