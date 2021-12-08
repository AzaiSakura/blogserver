var express = require('express');
var router = express.Router();
const message = require('../controllers/messageControllers');

router.post('/leaveMessage', message.leaveMessage)
router.post('/messageReply', message.messageReply)
router.get('/getMessage', message.getMessage)

module.exports = router;
