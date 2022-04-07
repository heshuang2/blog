const mongoose = require('mongoose')

// 创建一个Mongoose模型，按需引用
const schema = new mongoose.Schema({
    name: {
        type: String
    },
    account: {
        type: String
    },
    password: {
        type: String,
        select: false,
        set(val) {
            return require('bcryptjs').hashSync(val,10);
        }
    },
    desc: {
        type: String
    },
    email: {
        type: String
    },
    avatar: {
        type: String
    },
    datetime: {
        type: Date
    },
    tel: {
        type: Number
    },
    sex: {
        type: String
    },
    age: {
        type: Number
    },
    jurisdiction: {
        _id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Category'
        },
        name: {
            type: String
        }
    },
    desc: {
        type: String
    },
    online: {
        type: Number
    },
    locking: {
        type: Boolean
    }
})

module.exports = mongoose.model('User', schema)