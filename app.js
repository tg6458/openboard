const express = require("express");
const socket = require("socket.io");

const app = express(); //initilize the server

app.use(express.static(__dirname));

let port = process.env.PORT || 5000;
let server = app.listen(port, () => {
  console.log("Listening port " + port);
});

let io = socket(server);

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