const mongoose = require('mongoose')

// 创建一个Mongoose模型，按需引用
const schema = new mongoose.Schema({
    image: {
        type: String
    },
    content: {
        type: String
    },
    datetime: Date
})

module.exports = mongoose.model('Trivial', schema)