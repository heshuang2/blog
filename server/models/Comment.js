const mongoose = require('mongoose');

// 创建一个Mongoose模型，按需引用
const schema = new mongoose.Schema({
    article: {
        _id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Article'
        },
        title: {
            type: String
        }
    },
    name: {
        type: String
    },
    content: {
        type: String
    },
    children: [{
        name: {
            type: String
        },
        content: {
            type: String
        }
    }],
    datetime: Date
});

module.exports = mongoose.model('Comment', schema);
