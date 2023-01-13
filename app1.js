// const express = require("express");
// 
// var http = require('https');

// var server = app.listen(3000);
// const app = express(); //initilize the server
// app.use(express.static(__dirname + '/public'));
var express = require('express'),
    http = require('http');
    const socket = require("socket.io");
var app = express();
var server = http.createServer(app);
var io = socket.listen(server);
let port = process.env.PORT|| 5500;

server.listen(port);

app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.render('index.html');
});

// let server = app.listen(port, () => {
//   console.log("Listening port " + port);
// });

// let io = socket(server, {
//   cors: {
//     origin: '*',
//   }
// });

// var http = require('http');

// var io = app.listen(server);

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "",
//     methods: ["GET", "POST"]
//   }
// });

// server.listen(port);

io.on("connection", (socket) => {
  console.log("Made a connection");

  //transfer data to server to another
  socket.on("beginPath", (data) => {
    io.sockets.emit("beginPath", data);
  });

  socket.on("drawStroke", (data) => {
    io.sockets.emit("drawStroke", data);
  });

  socket.on("redoUndo", (data) => {
    io.sockets.emit("redoUndo", data);
  });
});

// header('Access-Control-Allow-Origin: *');
// header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
// header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Origin, Authorization');
