// 资源中间件
module.exports = (options) => {
    return async (req, res, next) => {
        if (
            (req.params.resource === 'messages' && req.params.userId != 'undefined') ||
            (req.params.resource === 'comments' && req.params.userId != 'undefined')
        ) {
            await req.Model.updateOne(
                { _id: req.params.userId },
                {
                    $pull: {
                        children: { _id: req.params.id }
                    }
                }
            );
            res.send({
                success: true
            });
        } else {
            next();
        }
    };
};
