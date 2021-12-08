const db = require('../utils/dbConfig');
const Jwt = require('../utils/jsonwebtoken');

/* 获取所有文章 */
getArticle = async (req, res) =>{
    let { page, pageSize } = req.query;
    /* 要返回的数据 */
    let message = {};
    /* 每页的数据 */
    let index = (page - 1) * pageSize;
    let sqlTotal = `SELECT COUNT(*) FROM article;`;
    let sqlTotalArr = [];
    const total = await db.asyncSqlConnect(sqlTotal, sqlTotalArr);
    message.count = total[0]["COUNT(*)"];
    let sql = `SELECT * FROM article ORDER BY article_id DESC LIMIT ?, ?;`;
    let sqlArr = [index, parseInt(pageSize)];
    let result = await db.asyncSqlConnect(sql, sqlArr);
    // console.log(result)
    if ( result[0] != null ) {
        message.data = result
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

/* 获取文章数量 */
getCount = async (req, res) => {
    let sqlTotal = `SELECT COUNT(*) FROM article;`;
    let sqlTotalArr = [];
    let result = await db.asyncSqlConnect(sqlTotal, sqlTotalArr);
    // console.log(result)
    if(result[0] != null) {
        res.send({
            'code': 200,
            'count': result[0]['COUNT(*)']
        })
    } else {
        res.send({
            'code': 400,
            "msg": '获取文章数量失败'
        })
    }
}

/* 获取标签 */
getLable = (req, res) => {
    let sql = `SELECT label, article_id From article`;
    let sqlArr = [];
    let callBack = (err, data) => {
        if (err) {
            console.log('连接出错了');
            res.send({
                'code': 400,
                'msg': '查询错误！'
            })
        } else {
            res.send({
                'code': 200,
                'data': data
            })
        }
    }
    db.sqlConnect(sql, sqlArr, callBack);
}

/* 根据标签获取文章详情 */
getArticleByLabel = async (req, res) => {
    let { label, page, pageSize } = req.body;
    /* 要返回的数据 */
    let message = {};
    /* 每页的数据 */
    let index = (page - 1) * pageSize;
    let sqlTotal = `SELECT COUNT(*) FROM article WHERE label = ?;`;
    let sqlTotalArr = [label];
   
    const total = await db.asyncSqlConnect(sqlTotal, sqlTotalArr);
    message.count = total[0]["COUNT(*)"];
    let sql = `SELECT * FROM article WHERE label = ? LIMIT ?, ?;`;
    let sqlArr = [label, index, parseInt(pageSize)];
    let result = await db.asyncSqlConnect(sql, sqlArr);
    // console.log(result)
    if ( result[0] != null ) {
        message.data = result
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

/* 获取文章分类 */
getCategory = (req, res) => {
    let sql = `SELECT category, COUNT(category) From article GROUP BY category;`;
    let sqlArr = [];
    let callBack = (err, data) => {
        // console.log(err, data)
        if (err) {
            console.log('连接出错了');
            res.send({
                'code': 400,
                'msg': '查询错误！'
            })
        } else {
            res.send({
                'code': 200,
                'data': data
            })
        }
    }
    db.sqlConnect(sql, sqlArr, callBack);
}

/* 根据分类获取文章详情 */
getArticleByCategory = async (req, res) => {
    let { category, page, pageSize } = req.body;
    /* 要返回的数据 */
    let message = {};
    /* 每页的数据 */
    let index = (page - 1) * pageSize;
    let sqlTotal = `SELECT COUNT(*) FROM article WHERE category = ?;`;
    let sqlTotalArr = [category];
    // let callBack = (err, data) => {
    //     if (!err) {
    //         /* 获取文章总数量 */
    //         // console.log(data);
    //         message.count = data[0]['COUNT(*)'];
    //     } else {
    //         /* 获取失败 */
    //         res.send({
    //             'code': 400,
    //             'msg': '获取失败'
    //         })
    //     }
    // }
    // db.sqlConnect(sqlTotal, sqlTotalArr, callBack);
    const total = await db.asyncSqlConnect(sqlTotal, sqlTotalArr);
    message.count = total[0]["COUNT(*)"];
    let sql = `SELECT * FROM article WHERE category = ? LIMIT ?, ?`;
    let sqlArr = [category, index, parseInt(pageSize)];
    let result = await db.asyncSqlConnect(sql, sqlArr);
    if ( result[0] != null ) {
        message.data = result
        res.send({
            'code': 200,
            'data': message
        })
    } else {
        res.send({
            'code': 400,
            'msg': '抱歉网络有点跟不上了，等一会再试试叭!'
        })
    }
}

/* 根据id获取文章详情 */
getArticleByid = async (req, res) => {
    let { article_id } = req.query;
    let sql = `SELECT * FROM article WHERE article_id = ?`;
    let sqlArr = [article_id];
    let result = await db.asyncSqlConnect(sql, sqlArr);
    if ( result[0] != null ) {
        let sqlUpdate = `UPDATE article SET visited = ? WHERE article_id = ?;`;
        let sqlUpdateArr = [++result[0].visited, article_id];
        let result1 = await db.asyncSqlConnect(sqlUpdate, sqlUpdateArr);
        res.send({
            'code': 200,
            'data': result[0]
        })
    } else {
        res.send({
            'code': 400,
            'msg': '抱歉网络有点跟不上了，等一会再试试叭!'
        })
    }
}

/* 获取近期发布文章 */
getRecentArticle = async (req, res) =>{
    /* SELETE * FROM 表名 WHERE 列名 BETWEEN '时间段1' AND '时间段2' */
    const now = (new Date()).valueOf();
    const last = now - 2592000000;
    let sql = `SELECT article_id, title, brief, create_time FROM article WHERE create_time BETWEEN ? AND ? ORDER BY article_id DESC LIMIT 6;`;
    let sqlArr = [last, now];
    let result = await db.asyncSqlConnect(sql, sqlArr);
    // console.log(result);
    if (result[0] != null ) {
        res.send({
            'code': 200,
            'data': result
        })
    } else {
        res.send({
            'code': 400,
            'msg': '网络不太好，请稍后再试'
        })
    }
}

/* 搜索文章 */
articleSearch = async (req, res) => {
    const { keyword } = req.body;
    let sql = `SELECT * FROM article WHERE title LIKE ? OR brief LIKE ? OR content LIKE ? OR label LIKE ? OR category LIKE ? ORDER BY article_id DESC;`;
    let sqlArr = ['%'+keyword+'%','%'+keyword+'%','%'+keyword+'%','%'+keyword+'%','%'+keyword+'%'];
    let result = await db.asyncSqlConnect(sql, sqlArr);
    console.log(result);
    if ( result[0] != null ) {
        res.send({
            'code': 200,
            'msg': '搜索成功',
            'data': result
        })
    } else {
        res.send({
            'code': 400,
            'msg': '查询文章出错了, 请把问题留言给我我好进行处理!'
        })
    }
}

/* 发布文章 */
articlePublish = async (req, res) => {
    const { admin_id,title, brief, category, img, label, content, name, avatar } = req.body
    let sql = `INSERT INTO article(admin_id,title, brief, category, img, label, content, create_time, update_time, name, avatar) VALUES (?,?,?,?,?,?,?,?,?,?,?);`;
    let sqlArr = [admin_id,title, brief, category, img, label, content, (new Date()).valueOf(), (new Date()).valueOf(), name, avatar];
    let result = await db.asyncSqlConnect(sql, sqlArr);
    // console.log(result);
    if ( result.affectedRows == 1 ) {
        res.send({
            'code': 200,
            'msg': '发布成功'
        })
    } else {
        res.send({
            'code': 400,
            'msg': '发布失败'
        })
    }
};

/* 更新文章 */
articleUpdate = async (req, res) => {
    const {admin_id, title, brief, category, img, label, content, article_id } = req.body
    let sql = `UPDATE article SET title = ?, brief = ?, img = ?, content = ?, label = ?, category = ?, update_time = ? WHERE article_id = ?`;
    let sqlArr = [title, brief, img, content, label, category, (new Date()).valueOf(), article_id]
    let result = await db.asyncSqlConnect(sql, sqlArr);
    // console.log(result)
    if (result.affectedRows == 1 ) {
        res.send({
            'code': 200,
            'msg': '文章更新成功'
        })
    } else {
        res.send({
            'code': 400,
            'msg': '更新失败'
        })
    }
    // console.log(result);
}

/* 给文章留言 */
leaveMessage = async ( req, res ) => {
    const { content, token, article_id } = req.body;
    Jwt.verifyToken(token)
        .then(async (data) => {
            const sqlSelect = `SELECT name, avatar FROM user WHERE username = ?;`;
            const sqlSelectArr = [data.data.username];
            const info = await db.asyncSqlConnect(sqlSelect, sqlSelectArr);
            if ( info[0] != null ) {
                const sqlInsert = `INSERT INTO article_message(article_id,username,name,imgsrc,content,create_time) VALUES (?,?,?,?,?,?);`;
                const sqlInsertArr = [article_id, data.data.username, info[0].name, info[0].avatar, content, (new Date()).valueOf()];
                const result = await db.asyncSqlConnect(sqlInsert, sqlInsertArr);
                // console.log(result);
                if ( result.affectedRows == 1 ) {
                    let sqlReply = `SELECT COUNT(*) FROM article_message wHERE article_id = ?;`;
                    let sqlReplyArr = [article_id];
                    let replyTotal = await db.asyncSqlConnect(sqlReply, sqlReplyArr);
                    let sqlUpdate = `UPDATE article SET replyCount = ? WHERE article_id = ?`;
                    let sqlUpdateArr = [replyTotal[0]['COUNT(*)'], article_id];
                    let updateResult = await db.asyncSqlConnect(sqlUpdate, sqlUpdateArr);
                    res.send({
                        'code': 200,
                        'msg': "留言成功啦~"
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

/* 回复留言 */
messageReply = async (req, res) => {
    const { message_id, reply_id, token, content } = req.body;
    // 检验回复者token，并获取个人信息
    Jwt.verifyToken(token)
    .then(async (data)=>{
        const sqlUser = `SELECT * FROM user WHERE username = ?;`;
        const sqlUserArr = [data.data.username];
        const userInfo = await db.asyncSqlConnect(sqlUser, sqlUserArr);
        if ( userInfo[0] != null ) {
            // 回复message
            if (message_id) {
                // 获取需回复的留言详情
                const sqlSearch1 = `SELECT * FROM article_message WHERE id = ?;`;
                const sqlSearchArr1 = [message_id];
                const messageInfo = await db.asyncSqlConnect(sqlSearch1, sqlSearchArr1);
                const sqlInsert1 = `INSERT INTO article_message_reply(reply_username, reply_name, reply_id, content, user_imgsrc, datetime, name, username) VALUES (?,?,?,?,?,?,?,?);`;
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
                        'msg': '网络不太好，稍后再试1~'
                    })
                }
            // 回复reply
            } else if (reply_id) {
                const sqlSearch2 = `SELECT * FROM article_message_reply WHERE id = ?;`;
                const sqlSearch2Arr = [reply_id];
                const replyInfo = await db.asyncSqlConnect(sqlSearch2, sqlSearch2Arr);
                console.log(replyInfo);
                const sqlInsert2 = `INSERT INTO article_message_reply(reply_username, reply_name, reply_id, content, user_imgsrc, datetime, name, username) VALUES (?,?,?,?,?,?,?,?);`;
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
                        'msg': '网络不太好，稍后再试~2'
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

/* 根据文章id获取消息 */
getMessageById = async (req, res) => {
    const { article_id, page, pageSize } = req.body;
    /* message为要返回的数据 */
    const message = {};
    /* 查询数据的序号 */
    const index = (page - 1) * pageSize;
    const sqlTotal = `SELECT COUNT(*) FROM article_message;`;
    const sqlTotalArr = [];
    const Total = await db.asyncSqlConnect(sqlTotal, sqlTotalArr);
    if(Total[0] != null) {
        message.count = Total[0]["COUNT(*)"];
        if(message.count > 0) {
            /* 倒叙寻找留言信息 */
            const sqlSearchM = `SELECT * FROM article_message WHERE article_id = ? ORDER BY id DESC LIMIT ?, ?;`;
            const sqlSearchMArr = [article_id, index, parseInt(pageSize)];
            const leaves = await db.asyncSqlConnect(sqlSearchM, sqlSearchMArr);
            // console.log(leaves)
            if (leaves[0] != null) {
                const sqlSearchR = `SELECT * FROM article_message_reply WHERE reply_id = ?;`;
                // 草，map里处理方法是同步的，若想异步操作要这样写才可以
                const arr = await Promise.all(leaves.map(async item => {
                    let sqlSearchRArr = [item.id];
                    let result = await db.asyncSqlConnect(sqlSearchR, sqlSearchRArr);
                    item.replyAccess = result;
                    // console.log(item)
                    return item;
                }));
                message.data = arr;
                res.send({
                    'code': 200,
                    'data': message
                })
            } else {
                res.send({
                    'code': 400,
                    'msg': '该分页没有内容呀，兄弟！'
                })
            }
        } else {
            res.send({
                'code': 400,
                'msg': '网络不太好，请稍后再试！'
            })
        }
    }
}

/* 删除文章接口 */
deleteMessage = async (req, res) => {
    const {article_id} = req.body
    const sql = `DELETE FROM article WHERE article_id = ?`;
    const sqlArr = [article_id];
    const callBack = (err, data) => {
        if(err){
            res.send({
                'code': 400,
                'msg': '删除失败，请稍后再试！'
            })
        } else {
            res.send({
                'code': 200,
                'msg': '删除文章成功~'
            })
        }
    }
    db.sqlConnect(sql, sqlArr, callBack);
}

module.exports = {
    getArticle,
    getCount,
    getLable,
    getCategory,
    getArticleByLabel,
    getArticleByCategory,
    getArticleByid,
    articlePublish,
    articleSearch,
    articleUpdate,
    getRecentArticle,
    leaveMessage,
    messageReply,
    getMessageById,
    deleteMessage
}