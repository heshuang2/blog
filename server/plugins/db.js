module.exports = app => {
    const mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1:27017/blog', {
        // 不加会报错
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
    mongoose.set('useFindAndModify', false);

    require('require-all')(__dirname + '/../models');
}