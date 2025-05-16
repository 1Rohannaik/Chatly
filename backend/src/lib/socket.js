const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chatly-hfoo.onrender.com",
    credentials: true,
  },
});

// Used to store online users
const userSocketMap = {}; // { userId: socketId }

const getReceiverSocketId = (userId) => {
  return userSocketMap[userId];
};

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // ✅ Handle sending messages
  socket.on("send-message", ({ message, to, from }) => {
    const receiverSocketId = getReceiverSocketId(to);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", {
        message,
        from,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    }
  });
});

module.exports = {
  io,
  app,
  server,
  getReceiverSocketId,
};
