let managerID = document.getElementById("uid").value;
const socket = io();
socket.on(`booking-${managerID}`, function (message) {
  console.log(message);
  showNotification(message, newBookingNotify);
});
socket.on(`cancelBooking-${managerID}`, function (message) {
  console.log(message);
  showNotification(message, cancelBookingNotify);
});
function showNotification(message, callback) {
  if (Notification.permission === "granted") {
    callback(message);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        callback(message);
      }
    });
  }
}

function newBookingNotify(message) {
  const notification = new Notification("New booking", {
    body: `You have an order at ${message.resName}:\nCheck in: ${message.ReserveTime}\nNumber of dinners: ${message.NumOfDiners}`,
    icon: "img/logo.png",
  });
  notification.onclick = (e) => {
    window.location.replace("/manager/BookingList");
  };
}

function cancelBookingNotify(message) {
  console.log(message);
  const notification = new Notification("Cancel booking", {
    body: `A dinner has been canceled at ${message.resName}:\nCheck in: ${message.ReserveTime}\nNumber of dinners: ${message.NumOfDiners}`,
    icon: "img/logo.png",
  });
  notification.onclick = (e) => {
    window.location.replace("/manager/BookingList");
  };
}
