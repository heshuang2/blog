const mongoose = require('mongoose')

// 创建一个Mongoose模型，按需引用
const schema = new mongoose.Schema({
    name: {
        type: String
    },
    children: [{
            num: {
                type: String
            },
            name: { 
                type: String
            }
    }],
    datetime: {
        type: Date
    }
})

module.exports = mongoose.model('Category', schema)