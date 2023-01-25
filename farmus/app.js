var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(connectRedis)
//app.use('/', indexRouter);
//app.use('/users', usersRouter);
require('./components/user/userRoute')(app);
//require('./components/farm/farmRoute')(app);

module.exports = app;
