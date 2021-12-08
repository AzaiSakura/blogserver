const db = require('../utils/dbConfig');

/* 获取音乐 */
getMusic = async (req, res) => {
    const { id } = req.query;
    let message = {};
    let sql1 = `SELECT music_id FROM music`;
    let sqlArr1 = [];
    const result1 = await db.asyncSqlConnect(sql1, sqlArr1);
    // console.log(result1)
    message.count = result1.length;
    if(result1[0]!=null){
        if(id == 0) {
            id = result1.length;
        } else if (id > result1.length) {
            id = 1;
        }
        let sql2 = `SELECT * FROM music WHERE music_id = ?;`;
        let sqlArr2 = [id];
        let result2 = await db.asyncSqlConnect(sql2, sqlArr2);
        message.data = result2[0]
        // console.log(result2);
        res.send({
            'code': 200,
            'msg': '获取音乐成功',
            'data': message
        })
    } else {
        res.send({
            'code': 400,
            'msg': '获取音乐失败~'
        })
    }
}

module.exports = {
    getMusic
}