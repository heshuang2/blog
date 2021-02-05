const express = require('express');

const app = express();

// 使用req.body获取post请求数据
app.use(express.json());
// 引用跨域模块
app.use(require('cors')());

// 静态文件托管
app.use('/uploads', express.static(__dirname + '/uploads'))

// 密钥
app.set('secret', 'jiur5fdsin2uhs');
// app传递
require('./routes/admin')(app);
require('./routes/web')(app);
require('./plugins/db')(app);

app.listen(3000, _ => {
    console.log("server running...");
})