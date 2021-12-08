var express = require('express');
var router = express.Router();
const multer = require('multer');
const admin = require('../controllers/adminController');
let upload = multer({ dest: __dirname + '/../public/images/article' }).single('file');


router.post('/adminUserCheck', admin.adminUserCheck);
router.post('/adminExit', admin.adminExit);
router.post('/adminIsLogined', admin.adminIsLogined);
router.post('/uploadCover', upload, admin.uploadCover);
router.get('/getUser', admin.getUser);
router.post('/deleteUser', admin.deleteUser);

module.exports = router;
