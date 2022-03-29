var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var cors = require('cors');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');
var articleRouter = require('./routes/article');
var videoRouter = require('./routes/video');
var messageRouter = require('./routes/leaveMessage');
var photoRouter = require('./routes/photo');
var musicRouter = require('./routes/music');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// session 生成
app.use(session({
  secret:'dsakljfldkjflkjgfdjg', //密钥
  cookie: {maxAge:60*1000*120}, //过期时间两小时
  resave:false,
  saveUninitialized: false
}))

app.use(logger('dev'));
/* 开发模式 */
app.use(cors({
  origin:['http://localhost:8080',''],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// 静态资源
app.use('/public', express.static(path.join(__dirname, 'public')));
// 请求
app.use(bodyParser.urlencoded({extended:true}));
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);
app.use('/article', articleRouter);
app.use('/video', videoRouter);
app.use('/message', messageRouter);
app.use('/photo', photoRouter);
app.use('/music', musicRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
