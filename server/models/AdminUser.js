const mongoose = require('mongoose')

// 创建一个Mongoose模型，按需引用
const schema = new mongoose.Schema({
    username: {
        type: String
    },
    password: {
        type: String,
        select: false,
        set(val) {
            return require('bcrypt').hashSync(val,10);
        }
    },
    avatar: {
        type: String
    },
    jurisdiction: {
        _id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Category'
        },
        name: {
            type: String
        }
    }
})

module.exports = mongoose.model('AdminUser', schema)