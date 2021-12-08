var express = require('express');
var router = express.Router();
const multer = require('multer');
const video = require('../controllers/videoControllers');
let upload = multer({ dest: __dirname + '/../public/images/video' }).single('file');

router.get('/getVideo', video.getVideo)
router.post('/upload', upload, video.upload)
router.post('/sendVideo', video.sendVideo)

module.exports = router;
