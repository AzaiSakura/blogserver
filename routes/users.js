var express = require('express');
const multer = require('multer');
var router = express.Router();
const user = require('../controllers/userControllers');
let upload = multer({ dest: __dirname + '/../public/images/avatar' }).single('file');

router.post('/sendEmail', user.sendEmail);
router.post('/login', user.login);
router.post('/getUserInfo', user.getUserInfo);
router.post('/editAvatar', upload, user.editAvatar);
router.post('/editUser', upload, user.editUser);

module.exports = router;
