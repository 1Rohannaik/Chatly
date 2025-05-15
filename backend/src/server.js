const express = require("express");
const { app, server } = require("./lib/socket");
const path = require("path");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const sequelize = require("./lib/db");
const port = process.env.PORT || 3000;
const errorHandler = require("./lib/error");
const authRoutes = require("./routes/userRoute");
const messageRoutes = require("./routes/messageRoute");
const cors = require("cors");

// Middleware
app.use(
  cors({
    origin: "https://chatly-hfoo.onrender.com", // only hosted frontend allowed
    credentials: true,
    optionsSuccessStatus: 200,
  })
);



app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/v1/users", authRoutes);
app.use("/api/v1/message", messageRoutes);

// Production static files
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

// Error handler
app.use(errorHandler);

// DB + Server
sequelize
  .sync()
  .then(() => {
    console.log("DB connected successfully");
    server.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
