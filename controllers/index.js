const db = require('../utils/dbConfig');

// 获取管理员账号
getAdmin = (req, res) => {
    let sql = `select * from admin`;
    let sqlArr = [];
    let callback = (err, data) => {
        if (err) {
            console.log('连接出错了');
        } else {
            res.send({
                'list': data
            })
        }
    };
    db.sqlConnect(sql, sqlArr, callback);
}

module.exports = {
    getAdmin
}