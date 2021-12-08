var express = require('express');
var router = express.Router();
const article = require('../controllers/articleController');

router.get('/getArticle', article.getArticle);
router.get('/getCount', article.getCount);
router.get('/getLable', article.getLable);
router.get('/getCategory', article.getCategory);
router.post('/getArticleByLabel', article.getArticleByLabel);
router.post('/getArticleByCategory', article.getArticleByCategory);
router.get('/getArticleByid', article.getArticleByid);
router.post('/articlePublish', article.articlePublish);
router.post('/articleUpdate', article.articleUpdate);
router.get('/getRecentArticle', article.getRecentArticle);
router.post('/articleSearch', article.articleSearch);
router.post('/leaveMessage', article.leaveMessage);
router.post('/messageReply', article.messageReply);
router.post('/getMessageById', article.getMessageById);
router.post('/deleteMessage', article.deleteMessage);

module.exports = router;
