const db = require('../utils/dbConfig');
const path = require('path');
const fs = require('fs')

/* 获取视频 */
getVideo = async (req, res) => {
    let { page, pageSize } = req.query;
    /* 要返回的数据 */
    let message = {};
    /* 每页的数据 */
    let index = (page - 1) * pageSize;
    let sqlTotal = `SELECT COUNT(*) FROM video;`;
    let sqlTotalArr = [];
    let Total = await db.asyncSqlConnect(sqlTotal, sqlTotalArr);
    // console.log(Total);
    message.count = Total[0]['COUNT(*)'];
    // let callBack = (err, data) => {
    //     if (!err) {
    //         /* 获取视频总数量 */
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
    // console.log(message)
    let sql = `SELECT * FROM video LIMIT ?, ?;`;
    let sqlArr = [index, parseInt(pageSize)];
    let result = await db.asyncSqlConnect(sql, sqlArr);
    // console.log(result);
    if (result[0] != null) {
        message.data = result;
        res.send({
            'code': 200,
            'data': message
        })
    } else {
        res.send({
            'code': 400,
            'msg': '查询失败！'
        })
    }
}

/* 上传视频及上传视频封面图片接口 */
upload = async (req, res) => {
    if ( req.file.length == 0 ) {
        res.send({'code': 400, 'msg': '上传文件不能为空！'})
    } else {
        let file = req.file;
        // console.log(file)
        let extname = path.extname(file.originalname);
        let newName = Date.now() + extname;
        fs.renameSync(file.path, __dirname + '/../public/images/video/' + newName);
        file.url = `http://localhost:3000/public/images/video/${newName}`;
        res.send({
            'code': 200,
            'msg': '上传成功',
            'file': file
        })
    }
}

/* 准备好数据上传视频 */
sendVideo = async (req, res) => {
    const { admin_id, video_url, video_pic, brief } = req.body;
    let sql = `INSERT INTO video(admin_id, video_url, video_pic, brief, create_time) VALUES (?,?,?,?,?);`;
    let sqlArr = [admin_id, video_url, video_pic, brief, (new Date()).valueOf() ];
    let result = await db.asyncSqlConnect(sql, sqlArr);
    if(result.affectedRows == 1) {
        res.send({
            'code': 200,
            'msg': '发表成功'
        })
    } else {
        res.send({
            'code': 400,
            'msg': '网络不太行，请稍后再试~'
        })
    }
    // console.log(result);
}

module.exports = {
    getVideo,
    upload,
    sendVideo
}