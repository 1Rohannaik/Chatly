const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser")
const sequelize = require("./db");
const app = express();
const port = process.env.PORT || 3000;
const authRoutes = require("../routes/authRoutes");
const errorHandler = require("./error")




app.use(express.json());
app.use(cookieParser());
app.use("/api/v1/users", authRoutes);



app.use(errorHandler);

sequelize
  .sync()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(port, () => {
      console.log(`Server is running on http://127.0.0.1:${port}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });
