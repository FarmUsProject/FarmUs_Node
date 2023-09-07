const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require("cors");
const { corsOptions } = require('./config/cors');
const fs = require('fs');
const app = express();

app.use(cors(corsOptions))
if (process.env.NODE_ENV === "production") {
    app.use(logger("combined"));
  } else {
    // development
    app.use(logger("dev"));
  }
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static('src'));
/*
app.get('/chat', function(req, res){
  fs.readFile('./src/index.html', (err, data) => {
      if(err) throw err;

      res.writeHead(200, {
          'Content-Type' : 'text/html'
      })
      res.write(data)
      res.end();
  });
});
*/
require('./components/user/userRoute')(app);
require('./components/farm/farmRoute')(app);
require('./components/reserve/reserveRoute')(app);
require('./components/post/postRoute')(app);
require('./components/oauth/oauthRoute')(app);

module.exports = app;
