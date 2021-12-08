const db = require('../utils/dbConfig');
const Jwt = require('../utils/jsonwebtoken');
const path = require('path');
const fs = require('fs')

/* 检测管理员是否为登录状态 */
adminIsLogined = (req, res) => {
    if (req.session.adminLogin) {
        res.send({
            'code': 200,
            'msg': '欢迎回来！'
        })
    } else {
        res.send({
            'code': 400,
            'msg': '您还没有登陆,请先去登陆！'
        })
    }
}

/* 后台管理员登录 */
adminUserCheck = async (req, res) => {
    const { password, username } = req.body;
    const sql = `SELECT * FROM admin WHERE username = ? AND password = ?`;
    const sqlArr = [username, password];
    const result = await db.asyncSqlConnect(sql, sqlArr);
    // console.log(result[0])
    if (result[0] != null) {
        req.session.adminLogin = true;
        res.send({
            'code': 200,
            'msg': '欢迎进入博客后台管理系统!',
            'data': result[0]
        })
    } else {
        res.send({
            'code': 200,
            'msg': '对不起，你不是管理员用户，不能进入该区域！请找站长拿账号！'
        })
    }
}

/* 后台退出 */
adminExit = (req, res) => {
    req.session.adminLogin = '';
    res.send({
        'code': 200,
        'msg': '退出后台管理系统成功！'
    })
}

/* 上传文章图片 */
uploadCover = async (req, res) => {
    console.log('test');
    if ( req.file.length == 0 ) {
        res.send({'code': 400, 'msg': '上传文件不能为空！'})
    } else {
        let file = req.file;
        console.log(file)
        let extname = path.extname(file.originalname);
        let newName = Date.now() + extname;
        fs.renameSync(file.path, __dirname + '/../public/images/article/' + newName);
        file.url = `http://localhost:3000/public/images/article/${newName}`;
        res.send({
            'code': 200,
            'msg': '上传成功',
            'file': file
        })
    }
}

/* 获取所有用户信息 */
getUser = async (req, res) => {
    let sql = `SELECT * FROM user;`;
    let sqlArr = [];
    let callBack = (err, data) => {
        if(err) {
            res.send({
                'code': 400,
                'msg': '获取用户信息失败！'
            })
        } else {
            res.send({
                'code': 200,
                'msg': '获取用户数据成功！',
                'data': data
            })
        }
    }
    db.sqlConnect(sql, sqlArr, callBack);
}

/* 删除用户 */
deleteUser = async (req, res) => {
    const { username } = req.body
    console.log(username)
    let sql = `DELETE FROM user WHERE username = ?;`;
    let sqlArr = [username];
    let callBack = (err, data) => {
        console.log(err)
        if (err) {
            res.send({
                'code': 400,
                'msg': '删除失败，请稍后再试！'
            })
        } else {
            res.send({
                'code': 200,
                'msg': '删除用户成功~'
            })
        }
    }
    db.sqlConnect(sql, sqlArr, callBack);
}

module.exports = {
    getUser,
    adminUserCheck,
    adminExit,
    adminIsLogined,
    uploadCover,
    getUser,
    deleteUser
}