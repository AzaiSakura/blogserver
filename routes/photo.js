var express = require('express');
var router = express.Router();
const multer = require('multer');
const tools = require('../utils/storage');
const photo = require('../controllers/photoControllers');

var picUpload = tools.photoMulter().single('file')

router.get('/',(req,res)=>{
    res.send({
        'code':200,
        'msg': '获取成功'
    })
})

router.post('/uploadPhotos',picUpload, photo.uploadPhotos);
router.get('/getPhoto', photo.getPhoto);
router.post('/sendPhotos', photo.sendPhotos);
router.post('/getPhotoById', photo.getPhotoById);

module.exports = router;
