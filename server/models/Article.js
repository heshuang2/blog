const mongoose = require('mongoose')

// 创建一个Mongoose模型，按需引用
const schema = new mongoose.Schema({
    title: {
        type: String
    },
    icon: {
        type: String
    },
    brief: {
        type: String
    },
    categories: [{
        _id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Category'
        },
        name: {
            type: String
        }
    }],
    datetime: Date,
    mdtext: {
        type: String
    },
    content: {
        type: String
    },
    views: {
        type: Number
    }
})

module.exports = mongoose.model('Article', schema)