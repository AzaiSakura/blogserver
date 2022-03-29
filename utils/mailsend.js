async function send(mail,code) { 
    const nodemailer = require('nodemailer');//导入模块
    let transporter = nodemailer.createTransport({
        host: 'smtp.qq.com',//邮件主机类型可以在lib库中选择
        port: 465,//端口
        secure: true,
        auth: {//作者
            user: '', // 发送者
            pass: '' // 发送者的邮箱smtp
        }
    });
    // 这里写邮件的详情信息
   let obj= {
        from: '"Fred Foo 👻" <>', // 发送者
        to: mail, // 接收者
        subject: '您有一条博客注册验证码',
        text: `您好, 您正在注册Sakura的博客账户,验证码:${code}如不是本人操作请忽略。`, //信息描述
    }
    // 开始发送
    return new Promise((resolve, reject) => {
        transporter.sendMail(obj,(err,res)=>{
            if (!err) {
                resolve({
                    code: 200,
                    msg: "发送验证码成功"
                })
            } else {
                reject({
                    code: 400,
                    msg: '验证码发送失败..'
                })
            }
        })

    }).catch((err)=>{
        console.log(err)
        return err
    })
}
module.exports = send;
