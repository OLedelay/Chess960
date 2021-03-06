// var createError = require('http-errors');
var express = require("express");
// var path = require('path');
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
// var usersRouter = require('./routes/users');
var messages = require("./public/javascripts/messages");

var port = process.argv[2];
var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
// app.use(express.static(__dirname + "/public"));
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
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

// module.exports = app;
app.get("/", indexRouter);
app.get("/play", indexRouter);
app.get("/rules", indexRouter);

http.createServer(app).listen(port);
// const wss = new websocket.Server({ server });
//
// var websockets = {};
