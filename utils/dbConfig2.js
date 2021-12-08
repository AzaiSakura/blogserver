const mysql = require('mysql');

module.exports = {
    // 数据库配置
    config: {
        host: 'localhost',
        port: '3306',
        user: 'root', //你的用户名
        password: '123456',
        database: 'blog_db'
    },
    
    // 连接数据库，使用mysql的连接池连接方式
    // 连接池对象
    sqlConnect: function(sql, sqlArr, callBack){
        let pool = mysql.createPool(this.config);
        pool.getConnection((err, connect) => {
            if (err) {
                console.log('连接失败');
                return;
            }
            console.log('连接成功');
            // 事件驱动回调
            connect.query(sql, sqlArr, callBack);
            // 释放连接
            connect.release();
        })
    },

    // 异步
    asyncSqlConnect: function(sql, sqlArr) {
        return new Promise((resolve, reject) => {
            let pool = mysql.createPool(this.config);
            pool.getConnection((err, connect) => {
                console.log('连接成功');
                if (err) {
                    reject(err);
                } else {
                    // 事件驱动回调
                    connect.query(sql, sqlArr, (err, data) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(data);
                        }
                    });
                    // 释放连接
                    connect.release();
                }
            })
        }).catch((err)=>{
            console.log(err);
        })
    }
}