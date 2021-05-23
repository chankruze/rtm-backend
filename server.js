/*
Author: chankruze (chankruze@geekofia.in)
Created: Sat May 15 2021 16:11:56 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2021 and beyond
*/

const PORT = 5050;
const io = require("socket.io")(PORT, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // fetch existing users
  const users = [];

  for (let [id, socket] of io.of("/").sockets) {
    users.push({ ...JSON.parse(socket.handshake.query.user), socketId: id });
  }

  // console.log(users);

  const userData = JSON.parse(socket.handshake.query.user);

  // notify existing users
  socket.broadcast.emit("user-online", {
    ...userData,
    isOnline: true,
    socketId: socket.id,
  });

  // forward the private message to the right recipient
  socket.on("message-private", ({ content, to }) => {
    socket.to(to).emit(
      "message-private",
      {
        content,
        from: userData.uid,
        to,
      },
      (delivered) => {
        console.log(`Message delivered: ${delivered}`);
      }
    );
  });

  // socket.on("message-sent", ({ content, to }) => {
  //   // room (group chat)
  //   // socket.broadcast.to().emit("message-received");
  //   // private (DM)
  //   const message = {
  //     content,
  //     from: uid,
  //     to,
  //   };
  //   socket.to(to).emit("message-received", message);
  // });

  socket.on("ack-online", (data) => {
    const receiver = data.to;
    delete data["to"];
    socket.to(receiver).emit("ack-online", { ...data });
  });

  socket.on("user-profile-update", (user) => {
    socket.broadcast.emit("user-online", { ...user, socketId: socket.id });
  });

  // notify users upon disconnection
  socket.on("disconnect", () => {
    console.log(`sending disconnect signal for ${socket.id}`);
    socket.broadcast.emit("user-offline", socket.id);
  });
});
