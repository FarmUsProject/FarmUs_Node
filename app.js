var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");

const { corsOptions } = require('./config/cors');
// var userRouter = require('./components/user/userRoute');
// var farmRouter = require('./components/farm/farmRoute');

var app = express();

app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use('/user', userRouter);
// app.use('/farm', farmRouter);
require('./components/user/userRoute')(app);
require('./components/farm/farmRoute')(app);

module.exports = app;