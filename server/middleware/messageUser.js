// 资源中间件
module.exports =  async (data, User, res, count) => {
    // 从数据库取回来的对象数组数据，是指向一个地址（堆栈问题）,它里面拥有很多可枚举属性什么的
   // 解决：遍历前使用深拷贝处理
    // const asyncModel = require('async');
    data = JSON.parse(JSON.stringify(data));
    for (const element of data) {
        for (const key in element.user) {
            const model = await User.findById(element.user[key]);
            element.user = model; 
        }
        for (const item of element.children) {
            const user = await User.findById(item.userId);
            const userInfo = await User.findById(item.userInfoId);
            item.user = user; 
            item.userInfo = userInfo; 
        }
    }
    res.send({data, count});
};
