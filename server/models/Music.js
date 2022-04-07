const mongoose = require('mongoose');

// 创建一个Mongoose模型，按需引用
const schema = new mongoose.Schema({
    id: {
        type: Number
    },
    name: {
        type: String
    },
    artist: {
        type: String
    },
    url: {
        type: String
    },
    cover: {
        type: String
    },
    lrc: {
        type: String
    }
});

module.exports = mongoose.model('Music', schema);
