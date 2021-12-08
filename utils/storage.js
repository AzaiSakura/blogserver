const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sd = require('silly-datetime');
const mkdirp = require('mkdirp');

let tools = {
    photoMulter() {
        var storage = multer.diskStorage({
            destination: async (req, file, cb) => {
                // const { id } = req.query;
                // console.log(id);
                // 获取当前日期
                let day = sd.format(new Date(), 'YYYYMMDD');

                let dir = path.join('public/images/photos',day);

                await mkdirp(dir);

                cb(null, dir);
            },
            filename: function (req, file, cb) {
                // 获取后缀名
                let extname = path.extname(file.originalname);
                // 根据时间戳生成文件名
                cb(null, Date.now() + extname);
            }
        })

        var upload = multer({ storage: storage })
    
        return upload
    }
}

module.exports = tools;