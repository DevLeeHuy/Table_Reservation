const userModel = require("../models/user.model");
var users = {};

module.exports = function (app) {
  app.io.on("connection", (socket) => {

    socket.on("newUser", async (user) => {
      const u = await userModel.getById(user.id);
      users[user.id] = u[0];
      socket.join(user.room);
      socket.room = user.room;

    });
    socket.on("chat-Customer", (data) => {
      socket.broadcast.in(socket.room).emit("chat", {
        user: users[data.from],
        message: data.message,
        restaurant: data.restaurant,
      });
    });
    socket.on("chat-Manager", (data) => {
      socket.broadcast.in(socket.room).emit("chat", data);
    });
  });
};
