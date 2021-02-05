
// 导出(app)函数，将app传递进来
module.exports = app => {
    const express = require('express');
    const jwt = require('jsonwebtoken');
    const assert = require('http-assert');
    const AdminUser = require('../../models/AdminUser');
    const auth = require('../../middleware/auth');
    const resource = require('../../middleware/resource');
    const router = express.Router({
        // 合并url参数
        mergeParams: true
    });

    // 创建资源接口
    router.post('/', async (req, res) => {
        console.log(req.body);
        // 创建数据
        const model = await req.Model.create(req.body);
        res.send(model);
    });
    // 修改资源接口
    router.put('/:id', async (req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body);
        console.log(model);
        res.send(model);
    });
    // 资源列表接口
    router.get('/', async (req, res) => {
        // console.log(req.Model.modelName);
        const queryOptions = {};
        // 创建数据,.populate('parent')关联查询,setOptions()将后面的链式操作转换为对象方式
        const items = await req.Model.find().setOptions(queryOptions).limit(10);
        
        res.send(items);
    });
    //  获取资源详情接口
    router.get('/:id', async (req, res) => {
        const model = await req.Model.findById(req.params.id);
        res.send(model);
    });
    // 删除资源接口
    router.delete('/:id', async (req, res) => {
        await req.Model.findByIdAndDelete(req.params.id, req.body);
        res.send({
            success: true
        });
    });
    // 添加中间件
    app.use('/admin/api/rest/:resource', auth(), resource(), router);
    // multer定义上传中间件
    const multer = require('multer');
    const upload = multer({
        dest: __dirname + '/../../uploads'
    });
    app.post('/admin/api/upload', auth(), upload.single('file'), async (req, res) => {
        const file = req.file;
        file.url = `http://localhost:3000/uploads/${file.filename}`;
        res.send(file);
    });

    app.post('/admin/api/login', async (req, res) => {
        const { username, password } = req.body;
        // console.log(username);
        // 1.根据用户名查找用户
        const user = await AdminUser.findOne({
            username
        }).select('+password');
        // 抛出错误异常
        assert(user, 422, '用户不存在');
        // 2.校验密码
        const isvalid = require('bcrypt').compareSync(password, user.password);
        // 抛出错误异常
        assert(isvalid, 422, '密码错误');
        // 3.返回token
        const content = {
            id: user._id
        };
        const token = jwt.sign(content, app.get('secret'), {
            expiresIn: 60 * 60 * 1 // 1小时过期
        });
        res.send({
            status: 200,
            msg: `欢迎您，${username}`,
            data: {
                username: user.username,
                avatar: user.avatar
            },
            token
        });
    });

    // 捕获错误异常，进行处理
    app.use(async (err, req, res, next) => {
        res.status(err.status || 500).send({
            message: err.message
        });
    });
};
