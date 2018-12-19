var express = require("express");
var http = require("http");
var websocket = require("ws");

var indexRouter = require("./routes/index");
var messages = require("./public/javascripts/messages");

var port = process.argv[2];
var app = express();

app.use(express.static(__dirname + "/public"));

app.get("/", indexRouter);
app.get("/play", indexRouter);
app.get("/rules", indexRouter);

http.createServer(app).listen(port);
// const wss = new websocket.Server({ server });
//
// var websockets = {};
