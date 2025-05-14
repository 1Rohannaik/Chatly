const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173", // Your local frontend URL
      "https://chatly-hfoo.onrender.com", // Your deployed frontend URL
    ],
    credentials: true, // Allow cookies and credentials
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

  // Emit list of online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

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
