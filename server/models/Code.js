const mongoose = require('mongoose');

// 创建一个Mongoose模型，按需引用
const schema = new mongoose.Schema({
    email: String,
    email_code: Number
});

module.exports = mongoose.model('Code', schema);
