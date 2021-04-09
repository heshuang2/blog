// 资源中间件
const Article = require('../models/Article');
module.exports = async (data, res) => {
    const items = await Article.find();
    // 文章评论处理
    items.forEach((key, i) => {
        data.forEach((item) => {
            if (key.title === item.article.title) {
                items[i].comments.push(item);
            }
        });
    });
    items.sort(function (a, b) {
        return a.datetime < b.datetime ? 1 : -1;
    });
    res.send(items);
};
