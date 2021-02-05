// 资源中间件
module.exports = (options) => {
    return async (req, res, next) => {
        const data = req.body;
            console.log(data);
        if (data.infoId != '') {
            const model = await req.Model.update(
                {
                    _id: data.infoId
                },
                {
                    $push: {
                        children: {
                            userId: data.user._id,
                            userInfoId: data.userInfo.id,
                            message: data.message,
                            datetime: data.datetime,
                            isReply: data.isReply
                        }
                    }
                }
            );
            res.send(model);
            /* const model = await req.Model.findById(user.infoId);
            console.log(model); */
        } else {
            next();
        }
    };
};
