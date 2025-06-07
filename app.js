var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');  // 여기에 미리 require 해요

var indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const boardRouter = require('./routes/board');
const productsRouter = require('./routes/products');
const noticeRouter = require('./routes/notice');
const mypageRouter = require('./routes/mypage');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// *** session 미들웨어를 라우터 전에 등록 ***
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// 라우터 등록 (session 미들웨어 이후)
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/board', boardRouter);
app.use('/products', productsRouter);
app.use('/notice', noticeRouter);
app.use('/mypage', mypageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
