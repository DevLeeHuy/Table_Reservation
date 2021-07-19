//CHAT BOX
const chat_btn = $("#chat-bot .icon");
const chat_box = $("#chat-bot .messenger");
const time = document.querySelector(".timestamp");
console.log(time);
time.innerText = new Date(parseInt(Date.now())).toLocaleTimeString(
  navigator.language,
  {
    hour: "2-digit",
    minute: "2-digit",
  }
);
chat_btn.click(() => {
  chat_btn.toggleClass("expanded");
  setTimeout(() => {
    chat_box.toggleClass("expanded");
  }, 100);
  chat_btn.removeClass("have-message");
});

const restaurant = document.getElementById("restaurant");
const resName = restaurant == null ? "" : restaurant.value;
const type = document.getElementById("type").value;
const uid = document.getElementById("uid").value;
const roomID = document.getElementById("rid").value;
console.log(roomID);
var sendBtn = document.querySelector(".send");
var chatroom = document.querySelector(".chatroom");
const socketio = io();

socketio.emit("newUser", { id: uid, room: roomID });

sendBtn.addEventListener("click", (ele) => {
  let message = document.querySelector(".typing").value;
  let data = { from: uid, room: roomID, restaurant: resName, message: message };
  socketio.emit(`chat-${type}`, data);
  chatroom.innerHTML = chatroom.innerHTML + msgRightHTML(message);
  document.querySelector(".typing").value = "";
});

socketio.on("chat", (data) => {
  chatroom.innerHTML = chatroom.innerHTML + msgLeftHTML(data);
  chat_btn.addClass("have-message");
});

window.setInterval(function () {
  chatroom.scrollTop = chatroom.scrollHeight;
}, 1000);

var msgLeftHTML = (data) => {
  if (data.user != null) {
    let gender = data.user.userGender === 1 ? "Chị" : "Anh";
    var name = gender + " " + data.user.userFName;
    var detail = "Hỏi về nhà hàng " + data.restaurant;
  } else {
    var name = "Quản lý";
  }
  return `<div class="msg msg-left">
  <div class="bubble">
  <h6 class="name">${name} <span>${detail || ""}</span></h6>
  ${data.message}
  </div>
  </div>`;
};

var msgRightHTML = (message) => `  
<div class="msg msg-right">
<div class="bubble">
<h6 class="name">Bạn</h6>
${message}
</div>
</div>`;
