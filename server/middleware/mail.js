// 邮箱验证码中间价
module.exports = (options)=>{
    const nodemailer = require('nodemailer')
    const smtpTransport = require('nodemailer-smtp-transport')

    const assert = require('http-assert')

    const transport = nodemailer.createTransport(smtpTransport({
        host: 'smtp.qq.com',
        service: 'qq',
        secure: true,
        // 我们需要登录到网页邮箱中，然后配置SMTP和POP3服务器的密码
        auth: {
            user: '1012918705@qq.com',
            pass: 'wnybtjqmufmibfbd'
        }
    }));

    const randomFns=()=> { // 生成4位随机数
        // 随机验证码
        return parseInt((Math.random() * 9000) + 1000);
    }

    return async(req,res,next)=>{
        let { email } = req.body
            let code = randomFns()
            await transport.sendMail({
                    from: '1012918705@qq.com', // 发件邮箱
                    to: email, // 收件列表
                    subject: '验证你的电子邮件', // 标题
                    html: `
            <p>你好！</p>
            <p>你的验证码是：<strong style="color: #ff4e2a;">${code}</strong></p>
            <p>***该验证码5分钟内有效***</p>` // html 内容
                },
                function(error, data) {
                    assert(!error, 500, "发送验证码错误！")
                    transport.close(); // 如果没用，关闭连接池
                })
            const Code = require("../models/Code")
            // const e_mail = email
            await Code.deleteMany({email})
            const [data] = await Code.insertMany({email,email_code: code});
            setTimeout(async ()=>{    //5分钟后失效
                await Code.deleteMany({email})
            },1000*60*5)
        next()
    }
}