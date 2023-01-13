const express = require("express");
const socket = require("socket.io");
var  http = require('http');

const app = express(); //initilize the server

app.use(express.static(__dirname));

let port = process.env.PORT || 5000;
// let server = app.listen(port, () => {
//   console.log("Listening port " + port);
// });

// let io = socket(server);

var server = http.createServer(app).listen(port, function(){
  console.log("Express server listening on port " + port);
});

var io = socket(server);
// io.sockets.on('connection', function () {
//   console.log('hello world im a hot socket');
// });

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