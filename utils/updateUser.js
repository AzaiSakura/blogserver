const db = require('./dbConfig');
function UpdateUser(selectSql, selectArr, updateSql, updateArr) {
    return new Promise(async (resolve, reject) => {
        const result = await db.asyncSqlConnect(selectSql, selectArr);
        if ( result[0] != null ) {
            db.sqlConnect(updateSql, updateArr, (err) => {
                console.log(err)
                if (!err) {
                    resolve("修改成功")
                } else {
                    reject("修改失败")
                }
            })
        } else {
            resolve("没有相关信息")
        }
    })
}

module.exports = {
    UpdateUser
}