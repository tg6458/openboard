let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let tool = canvas.getContext("2d");

let pencilContainer = document.querySelector(".pencil-container");
let pencilIcon = document.querySelector(".pencil-icon");
let pencilColorElem = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserIcon = document.querySelector(".eraser-icon");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download-icon");
let undo = document.querySelector(".undo-icon");
let redo = document.querySelector(".redo-icon");

let pencilColor = "rgba(0,0,0,0)";
let pencilWidth = pencilWidthElem.value;
let prvColor = "black";
let pencilIconClick = false;
let eraserIconClick = false;
let flag1;
let undoRedoTracker = [];
let track;

//pencil
pencilIcon.addEventListener("click", (e) => {
  pencilIconClick = !pencilIconClick;
  if (pencilIconClick) {
    pencilColor = prvColor;
    pencilWidth = pencilWidthElem.value;
    flag1 = true;
  } else {
    prvColor = pencilColor;
    pencilColor = "rgba(0,0,0,0)";
  }
});

pencilWidthElem.addEventListener("change", (e) => {
  pencilWidth = pencilWidthElem.value;
});

pencilColorElem.forEach((colorElem) => {
  colorElem.addEventListener("click", (e) => {
    let color = colorElem.classList[0];
    pencilColor = color;
  });
});

//eraser
let eraserColor = "white";
let eraserWidth = eraserWidthElem.value;
eraserIcon.addEventListener("click", (e) => {
  eraserIconClick = !eraserIconClick;
  if (eraserIconClick) {
    eraserColor = "white";
    flag1 = false;
  } else {
    eraserColor = "rgba(0,0,0,0)";
  }
});

eraserWidthElem.addEventListener("change", (e) => {
  eraserWidth = eraserWidthElem.value;
});

let mousedown = false;
canvas.addEventListener("mousedown", (e) => {
  mousedown = true;
  let data = {
    x: e.clientX,
    y: e.clientY,
  };
  socket.emit("beginPath", data);
});

canvas.addEventListener("mousemove", (e) => {
  if (mousedown) {
    let data = {
      x: e.clientX,
      y: e.clientY,
      color: flag1 ? pencilColor : eraserColor,
      width: flag1 ? pencilWidth : eraserWidth,
    };
    socket.emit("drawStroke", data);
  }
});

canvas.addEventListener("mouseup", (e) => {
  mousedown = false;

  let url = canvas.toDataURL();
  undoRedoTracker.push(url);
  track = undoRedoTracker.length - 1;
});

function beginPath(strokeObj) {
  tool.beginPath();
  tool.moveTo(strokeObj.x, strokeObj.y);
}
function drawStroke(strokeObj) {
  tool.strokeStyle = strokeObj.color;
  tool.lineWidth = strokeObj.width;
  tool.lineTo(strokeObj.x, strokeObj.y);
  tool.stroke();
}

//download
download.addEventListener("click", (e) => {
  let url = canvas.toDataURL();
  let a = document.createElement("a");
  a.href = url;
  a.download = "board.jpg";
  a.click();
});

//undo
undo.addEventListener("click", (e) => {
  if (track > 0) track--;

  let data = {
    trackdata: track,
    undoRedoTracker,
  };

  socket.emit("redoUndo", data);
});

//redo
redo.addEventListener("click", (e) => {
  if (track < undoRedoTracker.length) track++;

  let data = {
    trackdata: track,
    undoRedoTracker,
  };

  socket.emit("redoUndo", data);
});

function undoRedo(trackobj) {
  track = trackobj.trackdata;
  undoRedoTracker = trackobj.undoRedoTracker;

  let url = undoRedoTracker[track];
  let img = new Image();
  img.src = url;

  img.onload = (e) => {
    tool.drawImage(img, 0, 0, canvas.width, canvas.height);
  };
}

//transfer data from server to original pc

socket.on("beginPath", (data) => {
  beginPath(data);
});

socket.on("drawStroke", (data) => {
  drawStroke(data);
});

socket.on("redoUndo", (data) => {
  undoRedo(data);
});
