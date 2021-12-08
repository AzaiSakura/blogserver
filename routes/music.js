var express = require('express');
var router = express.Router();
const music = require('../controllers/musicController');

router.get('/getMusic', music.getMusic)

module.exports = router;