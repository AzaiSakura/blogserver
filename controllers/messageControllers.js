const db = require('../utils/dbConfig');
const jwt = require("../utils/jsonwebtoken");


/* 留言板留言 */
leaveMessage = async (req, res) => {
    const { content, token } = req.body;
    jwt.verifyToken(token)
        .then(async (data) => {
            // console.log(data);
            const sqlSelect = `SELECT name, avatar FROM user WHERE username = ?;`;
            const sqlSelectArr = [data.data.username];
            const info = await db.asyncSqlConnect(sqlSelect, sqlSelectArr);
            if ( info[0] != null ) {
                const sqlInsert = `INSERT INTO leave_message(username,name,imgsrc,content,create_time) VALUES (?,?,?,?,?);`;
                const sqlInsertArr = [data.data.username, info[0].name, info[0].avatar, content, (new Date()).valueOf()];
                const result = await db.asyncSqlConnect(sqlInsert, sqlInsertArr);
                // console.log(result);
                if ( result.affectedRows == 1 ) {
                    res.send({
                        'code': 200,
                        'msg': "发表成功啦,(●'◡'●)博主来的时候就可以看见你的留言啦!"
                    })
                } else {
                    res.send({
                        'code': 400,
                        'msg': '留言失败，检查一下网络设置叭！'
                    })
                }
            } else {
                res.send({
                    'code': 400,
                    'msg': '获取不到用户信息呢，亲~'
                })
            }
        }).catch((err) => {
            // console.log(err.data.name)
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

/* 两种方法获取要回复信息的数据
    1.前端获取数据后传进来
    2.前端获取id后传进来查询
    此处用第二种，简化前端代码？这种做不了楼中楼
    第一种？
    步骤：
    1.传进message_id或者reply_id,token,content
    2.若传进来的是message_id(回复留言)则先用id获取需回复留言的详情，检查回复者token，获取个人信息，在整理插入
    3.若传进来的是reply_id(回复回复)则用id获取回复的详情，拿出username，name，date，检查回复者token，获取个人信息，再整理插入
    4.两个都有检查回复者token，所以先放前面
*/
messageReply = async (req, res) => {
    const { message_id, reply_id, token, content } = req.body;
    // 检验回复者token，并获取个人信息
    jwt.verifyToken(token)
    .then(async (data)=>{
        const sqlUser = `SELECT * FROM user WHERE username = ?;`;
        const sqlUserArr = [data.data.username];
        const userInfo = await db.asyncSqlConnect(sqlUser, sqlUserArr);
        if ( userInfo[0] != null ) {
            // 回复message
            if (message_id) {
                // 获取需回复的留言详情
                const sqlSearch1 = `SELECT * FROM leave_message WHERE id = ?;`;
                const sqlSearchArr1 = [message_id];
                const messageInfo = await db.asyncSqlConnect(sqlSearch1, sqlSearchArr1);
                const sqlInsert1 = `INSERT INTO leave_message_reply(reply_username, reply_name, reply_id, content, user_imgsrc, datetime, name, username) VALUES (?,?,?,?,?,?,?,?);`;
                const sqlInsertArr1 = [messageInfo[0].username, messageInfo[0].name, message_id, content, userInfo[0].avatar, (new Date()).valueOf(), userInfo[0].name, userInfo[0].username];
                const result1 = await db.asyncSqlConnect(sqlInsert1, sqlInsertArr1);
                // console.log(result1);
                if (result1.affectedRows == 1) {
                    res.send({
                        'code': 200,
                        'msg': '回复成功啦~'
                    })
                } else {
                    res.send({
                        'code': 400,
                        'msg': '网络不太好，稍后再试~'
                    })
                }
            // 回复reply
            } else if (reply_id) {
                const sqlSearch2 = `SELECT * FROM leave_message_reply WHERE id = ?;`;
                const sqlSearch2Arr = [reply_id];
                const replyInfo = await db.asyncSqlConnect(sqlSearch2, sqlSearch2Arr);
                console.log(replyInfo);
                const sqlInsert2 = `INSERT INTO leave_message_reply(reply_username, reply_name, reply_id, content, user_imgsrc, datetime, name, username) VALUES (?,?,?,?,?,?,?,?);`;
                const sqlInsert2Arr = [replyInfo[0].username, replyInfo[0].name, replyInfo[0].reply_id, content, userInfo[0].avatar, (new Date()).valueOf(), userInfo[0].name, userInfo[0].username]
                const result2 = await db.asyncSqlConnect(sqlInsert2, sqlInsert2Arr);
                // console.log(result2);
                if (result2.affectedRows == 1) {
                    res.send({
                        'code': 200,
                        'msg': '回复成功啦~'
                    })
                } else {
                    res.send({
                        'code': 400,
                        'msg': '网络不太好，稍后再试~'
                    })
                }
            }
        } else {res.send({'code':400,'msg':'网络不太行，请稍后再试！'})}
    }).catch((err)=>{
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

/* 获取留言 */
getMessage = async (req, res) => {
    const { page, pageSize } = req.query;
    /* message为要返回的数据 */
    const message = {};
    /* 查询数据的序号 */
    const index = (page - 1) * pageSize;
    const sqlTotal = `SELECT COUNT(*) FROM leave_message;`;
    const sqlTotalArr = [];
    const Total = await db.asyncSqlConnect(sqlTotal, sqlTotalArr);
    if(Total[0] != null) {
        message.count = Total[0]["COUNT(*)"];
        if (message.count > 0) {
            /* 倒叙寻找留言信息 */
            const sqlSearchM = `SELECT * FROM leave_message ORDER BY id DESC LIMIT ?, ?;`;
            const sqlSearchMArr = [index, parseInt(pageSize)];
            const leaves = await db.asyncSqlConnect(sqlSearchM, sqlSearchMArr);
            // console.log(leaves);
            if (leaves[0] != null) {
                const sqlSearchR = `SELECT * FROM leave_message_reply WHERE reply_id = ?;`;
                // map里处理方法是同步的，若想异步操作要这样写才可以
                const arr = await Promise.all(leaves.map(async item => {
                    let sqlSearchRArr = [item.id];
                    let result = await db.asyncSqlConnect(sqlSearchR, sqlSearchRArr);
                    item.replyAccess = result;
                    // console.log(item)
                    return item;
                }));
                // console.log(arr);
                message.data = arr;
                res.send({
                    'code': 200,
                    'data': message
                })
            } else {
                res.send({
                    'code': 400,
                    'msg': '该分页没有内容呀~'
                })
            }
        }
    }  
}


module.exports = {
    leaveMessage,
    messageReply,
    getMessage
}