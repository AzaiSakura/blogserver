const db = require('../utils/dbConfig');
const Jwt = require('../utils/jsonwebtoken')
const path = require('path');
const fs = require('fs')
const send = require('../utils/mailsend');
const { UpdateUser } = require('../utils/updateUser');

// 发送邮箱接口
sendEmail = async (req, res) => {
    const { email } = req.body;
    let code = parseInt(Math.random() * 999999);
    // console.log(1)
    let result = await send(email, code);
    console.log(result);
    if (result.code == 200) {
        req.session.registerCode = code;
        res.send({
            'code': 200,
            'msg': '发送成功'
        })
    } else {
        res.send({
            'code': 400,
            'msg': '发送失败。。。'
        })
    }
}

/* 登录注册结合的一个接口 */
login = async (req, res) => {
    const { username, password, email, code } = req.body;
    // console.log(username, password, email, code)
    // 登录状态
    if (!email) {
        let sql = `SELECT * FROM user WHERE username = ? AND password = ?`;
        let sqlArr = [username, password];
        let result = await db.asyncSqlConnect(sql, sqlArr);
        // console.log(result)
        if (result[0] != null) {
            // 登录成功，生成一个token给传给前端
            const token = Jwt.createToken({
                username,
                login: true
            })
            res.send({
                'code': 200,
                'msg': '登录成功啦~',
                'data': result[0],
                'token': token
            })
        } else {
            res.send({
                'code': 400,
                'msg': '用户名或密码错误~',
                'data': []
            })
        }
    } else {
        /* 否则就是注册状态 */
        /* 生成一个用户名传进去 */
        if(!req.session.registerCode) {
            res.send({
                'code': 400,
                'msg': "您还没发送过验证码"
            })
        } else {
            if (code == req.session.registerCode) {
                let hashcode = 'TakeOff' + parseInt("000" + Math.random() * 999);
                let sql = `INSERT INTO user(username,password,email,name,register_time) VALUES(?,?,?,?,?)`;
                let sqlArr = [username, password, email, hashcode, (new Date()).valueOf()];
                let result = await db.asyncSqlConnect(sql,sqlArr);
                // console.log(result);
                if (result) {
                    /* 注册成功 生成token给用户传过去 */
                    const token = Jwt.createToken({ username, login:true });
                    delete req.session.registerCode;
                    res.send({
                        'code': 200,
                        'msg': '注册成功啦~~~',
                        'username': username,
                        'token': token
                    })
                } else {
                    res.send({
                        'code': 400,
                        'msg': '注册的账号已经被抢先！'
                    })
                }
            } else {
                res.rend({
                    'code': 200,
                    'msg': '注册失败验证码错误'
                })
            }
        }
    }
}

/* 获取用户信息 */
getUserInfo = async (req, res) => {
    const {token} = req.body;
    Jwt.verifyToken(token)
        .then(async (data) => {
            // console.log(data);
            let sql = `SELECT name, introduction, avatar FROM user WHERE username = ?`;
            let sqlArr = [data.data.username];
            let info = await db.asyncSqlConnect(sql, sqlArr);
            // console.log(info)
            if (data) {
                res.json({
                    'code': 200,
                    'Info': info[0]
                })
            }
        }).catch((err)=>{
            // console.log('err',err)
            /* token过期 */
            if (err.data.name === 'TokenExpiredError') {
                res.send({
                    'code': 401,
                    'msg': '登陆信息已过期请重新登陆!'
                })
            } else {
                res.send({
                    'code': 400,
                    'msg': '非法的token'
                })
            }
        })
}

/* 更改头像 */
editAvatar = async (req, res) => {
    const { token, username } = req.body;
    if ( req.file.length === 0) {
        res.send({'code': 400, 'msg': '上传文件不能为空！'})
    } else {
        let file = req.file;
        let extname = path.extname(file.originalname);
        let newName = Date.now() + extname;
        console.log(newName)
        fs.renameSync(file.path, __dirname + '/../public/images/avatar/' + newName);
        file.url = `http://localhost:3000/public/images/avatar/${newName}`;
        
        res.send({
            'code':200,
            'msg': '上传成功',
            'file': file
        })
        // console.log(file);        
    }
}

/* 修改用户信息 */
editUser = async (req, res) => {
    const { name, introduction, token, avatar } = req.body;
    Jwt.verifyToken(token)
        .then(async (data) => {
            const userSql = `UPDATE user SET name=?, introduction=?, avatar=? WHERE username=?;`;
            const userArr = [name,introduction,avatar,data.data.username];
            const result = await db.asyncSqlConnect(userSql, userArr);
            if(result.affectedRows==1){
                /* 首先进行查找留言中有没有个人的留言信息，如果有就修改没有就返回 */
                const sqlSelect = `SELECT username FROM leave_message WHERE username = ?;`;
                const sqlSelectArr = [data.data.username];
                const sqlUpdate = `UPDATE leave_message SET name = ?, imgsrc =? WHERE username = ?;`;
                const sqlUpdateArr = [name, avatar, data.data.username];
                const promise1 = UpdateUser(sqlSelect, sqlSelectArr, sqlUpdate, sqlUpdateArr);

                /* 文章评论信息更新 */
                const articleSelect = `SELECT username FROM article_message WHERE username = ?;`;
                const articleSelectArr = [data.data.username]
                const articleUpdate = `UPDATE article_message SET name = ?, imgsrc =? WHERE username = ?;`;
                const articleUpdateArr = [name, avatar, data.data.username];
                const promise2 = UpdateUser(articleSelect, articleSelectArr, articleUpdate, articleUpdateArr);

                /* 留言回复的信息更新 */
                const replySelect = `SELECT username FROM leave_message_reply WHERE username = ?;`;
                const replySelectArr = [data.data.username];
                const replyUpdate = `UPDATE leave_message_reply SET name = ?, user_imgsrc =? WHERE username = ?;`;
                const replyUpdateArr = [name, avatar, data.data.username];
                const promise3 = UpdateUser(replySelect, replySelectArr, replyUpdate, replyUpdateArr);

                /* 文章评论回复信息更新 */
                const aReplySelect = `SELECT username FROM article_message_reply WHERE username = ?;`;
                const aReplySelectArr = [data.data.username];
                const aReplyUpdate = `UPDATE article_message_reply SET name = ?, user_imgsrc =? WHERE username = ?;`;
                const aReplyUpdateArr = [name, avatar, data.data.username];
                const promise4 = UpdateUser(aReplySelect, aReplySelectArr, aReplyUpdate, aReplyUpdateArr);
                
                Promise.all([promise1,promise2,promise3,promise4])
                    .then(async (success) => {
                        // console.log(success)
                        const sqlGet = `SELECT * FROM user WHERE username = ?`;
                        const sqlGetArr = [data.data.username];
                        const result = await db.asyncSqlConnect(sqlGet, sqlGetArr);
                        if (result[0] != null){
                            res.json({
                                'code': 200,
                                'msg': "您的信息修改成功啦",
                                'data': result[0]
                            })   
                        }
                    })
                    .catch((err) => {
                        // console.log(err)
                        res.json({
                            'code': 400,
                            'msg': '网络不太行，请稍后再试~'
                        })
                    })

            } else {
                res.send({
                    'code': 400,
                    'msg': '网络不太行，请稍后再试~'
                })
            }
        }).catch((err) => {
            /* token 过期 */
            // console.log(err)
            if (err.data.name === "TokenExpiredError") {
                return res.json({ code: 401, message: "登陆信息已过期请重新登陆!" });
            } else {
                return res.json({ code: 400, message: "非法的token!" });
            }
        })
}

module.exports = {
    sendEmail,
    login,
    getUserInfo,
    editAvatar,
    editUser
}