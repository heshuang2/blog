const mongoose = require('mongoose');

// 创建一个Mongoose模型，按需引用
const schema = new mongoose.Schema({
    user: {
        _id: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User'
        }
    },
    message: {
        type: String
    },
    datetime: Date,
    children: [
        {
            userId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'User'
            },
            userInfoId: {
                type: mongoose.SchemaTypes.ObjectId,
                ref: 'User'
            },
            message: {
                type: String
            },
            datetime: Date,
            isReply: {
                type: Number
            }
        }
    ]
});

module.exports = mongoose.model('Message', schema);
