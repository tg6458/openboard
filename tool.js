let menuIcon = document.querySelector(".menu-container");
let toolCont = document.querySelector(".tool-container");
let pencil = document.querySelector(".pencil-icon");
let pencilCont = document.querySelector(".pencil-container");
let eraser = document.querySelector(".eraser-icon");
let eraserCont = document.querySelector(".eraser-container");
let stickyCont = document.querySelector(".sticky-icon");
let upload = document.querySelector(".upload-icon");
let completeBody = document.getElementsByTagName("body");
let reload = document.querySelector(".reload-icon");

let flag = true;
let eraserFlag = false;
let pencilFlag = false;

menuIcon.addEventListener("click", (e) => {
  flag = !flag;
  let x = menuIcon.children[0];
  if (flag) {
    x.classList.remove("fa-times");
    x.classList.add("fa-bars");
    toolCont.style.display = "flex";
  } else {
    x.classList.remove("fa-bars");
    x.classList.add("fa-times");
    toolCont.style.display = "none";
    pencilCont.style.display = "none";
    eraserCont.style.display = "none";
    pencilFlag = !pencilFlag;
    eraserFlag = !eraserFlag;
  }
});
//pencil
pencil.addEventListener("click", (e) => {
  pencilFlag = !pencilFlag;
  if (pencilFlag) {
    pencilCont.style.display = "block";
    completeBody[0].style.cursor =
      "url(http://www.cursor.cc/cursor/263/42/cursor.png), auto";
    eraserCont.style.display = "none";
  } else {
    pencilCont.style.display = "none";
    completeBody[0].style.cursor = "default";
  }
});

//eraser
eraser.addEventListener("click", (e) => {
  eraserFlag = !eraserFlag;
  if (eraserFlag) {
    eraserCont.style.display = "flex";
    completeBody[0].style.cursor = "url('Icons/cursor.cur') ,auto";
    pencilCont.style.display = "none";
  } else {
    eraserCont.style.display = "none";
    completeBody[0].style.cursor = "default";
  }
});

//create sticky-note
stickyCont.addEventListener("click", (e) => {
  let stickyContHTML = `<div class="sticky-bar">
    <i class="fas fa-minus"></i>
    <i class="fas fa-times"></i>
    </div>
    <div class="note-input">
        <textarea spellcheck="false"></textarea>
    </div>`;
  createStickyNote(stickyContHTML);
});

//upload
upload.addEventListener("click", (e) => {
  let input = document.createElement("input");
  input.setAttribute("type", "file");
  input.click();

  input.addEventListener("change", (e) => {
    let file = input.files[0];
    let url = URL.createObjectURL(file);
    console.log(url);
    let stickyContHTML = `<div class="sticky-bar">
        <i class="fas fa-minus"></i>
        <i class="fas fa-times"></i>
        </div>
        <div class="note-input">
           <img src="${url}"/>
        </div>`;
    createStickyNote(stickyContHTML);
  });
});

function createStickyNote(stickyContHTML) {
  let sticky = document.createElement("div");
  sticky.innerHTML = stickyContHTML;
  sticky.setAttribute("class", "sticky-container");
  document.body.appendChild(sticky);
  let remove = sticky.querySelector(".fa-times");
  let minimize = sticky.querySelector(".fa-minus");

  stickyAction(remove, minimize, sticky);
  sticky.onmousedown = function (event) {
    dragAndDrop(sticky, event);
  };
  sticky.ondragstart = function () {
    return false;
  };
}

function stickyAction(remove, minimize, sticky) {
  remove.addEventListener("click", (e) => {
    sticky.remove();
  });

  minimize.addEventListener("click", (e) => {
    let mini = sticky.querySelector(".note-input");
    let display = getComputedStyle(mini).getPropertyValue("display");
    if (display === "none") mini.style.display = "block";
    else mini.style.display = "none";
  });
}

//drag and drop code
function dragAndDrop(element, event) {
  let shiftX = event.clientX - element.getBoundingClientRect().left;
  let shiftY = event.clientY - element.getBoundingClientRect().top;
  element.style.position = "absolute";
  element.style.zIndex = 1000;
  moveAt(event.pageX, event.pageY);
  function moveAt(pageX, pageY) {
    element.style.left = pageX - shiftX + "px";
    element.style.top = pageY - shiftY + "px";
  }
  function onMouseMove(event) {
    moveAt(event.pageX, event.pageY);
  }
  document.addEventListener("mousemove", onMouseMove);
  element.onmouseup = function () {
    document.removeEventListener("mousemove", onMouseMove);
    element.onmouseup = null;
  };
}

reload.addEventListener("click", (e) => {
  location.reload();
});
