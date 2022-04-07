const mongoose = require('mongoose');

// 创建一个Mongoose模型，按需引用
const schema = new mongoose.Schema({
    avatar: {
        type: String
    },
    name: {
        type: String
    },
    desc: {
        type: String
    },
    link: {
        type: String
    },
    datetime: Date
});

module.exports = mongoose.model('FriendLink', schema);
