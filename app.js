const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const { corsOptions } = require('./config/cors');

const app = express();

app.use(cors(corsOptions))
if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined"));
  } else {
    // development
    app.use(morgan("dev"));
  }
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

require('./components/user/userRoute')(app);
require('./components/farm/farmRoute')(app);
require('./components/reserve/reserveRoute')(app);
require('./components/post/postRoute')(app);
require('./components/oauth/oauthRoute')(app);

module.exports = app;
