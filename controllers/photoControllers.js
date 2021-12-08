const db = require('../utils/dbConfig');
const fs = require('fs');
const path = require('path');

// 上传照片
uploadPhotos = async (req, res) => {
    const { pic_id, admin_id, username, desc } = req.body;
    const { file } = req;
    // 管理员上传图片
    if (admin_id) {
        // 先不做
    }
    file.url = `http://localhost:3000/${file.path}`
    res.send({
        'code': 200,
        'msg': '上传成功！',
        'file': file
    })
}

// 准备好数据上传的接口
sendPhotos = async (req, res) => {
    const { admin_id, brief, username, imgsrc } = req.body;
    let sql = `INSERT INTO photo(admin_id, brief, imgsrc, create_time) VALUES (?,?,?,?);`;
    let sqlArr = [admin_id, brief, imgsrc, (new Date()).valueOf()];
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

// 获取相册接口
getPhoto = async (req, res) => {
    const { page, pageSize } = req.query;
    let index = (page - 1) * pageSize;
    let sql = `SELECT * FROM photo;`;
    let sqlArr = [];
    let result = await db.asyncSqlConnect(sql, sqlArr);
    // console.log(result)
    res.send({
        'code': 200,
        'msg': '获取成功',
        'data': result
    })
}

// 根据id获取相册内容
getPhotoById = async (req, res) => {
    const { pic_id } = req.body;
    let sql = `SELECT * FROM photo WHERE pic_id = ?;`;
    let sqlArr = [pic_id];
    let result = await db.asyncSqlConnect(sql, sqlArr);
    // console.log(result)
    if ( result[0] !== null ) {
        res.send({
            'code': 200,
            'msg': '获取相册详情成功',
            'data': result[0]
        })
    } else {
        res.send({
            'code': 400,
            'msg': '网络不太好，请稍后再试~'
        })
    }

}

module.exports = {
    getPhoto,
    uploadPhotos,
    sendPhotos,
    getPhotoById
}