const express = require("express");
const {app,server}=require("./lib/socket")
require("dotenv").config();
const cookieParser = require("cookie-parser");
const sequelize = require("./lib/db");
const port = process.env.PORT || 3000;
const errorHandler = require("./lib/error")
const authRoutes = require("./routes/userRoute")
const messageRoutes = require("./routes/messageRoute");
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173", 
      "https://chatly-hfoo.onrender.com", 
    ],
    credentials: true, 
    optionsSuccessStatus: 200, 
  })
);

app.use(express.json())
app.use(cookieParser());


app.use("/api/v1/users", authRoutes);
app.use("/api/v1/message", messageRoutes);

 
app.use(errorHandler);

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

