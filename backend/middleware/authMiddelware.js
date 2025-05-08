const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(400).json({
        status: "error",
        message: "unauthorised no token provided",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECREAT);
    if (!decoded) {
      return res.status(400).json({
        status: "error",
        message: "unauthorised invalid token",
      });
    }

    const user = await User.findByPk(decoded.userId, {
      attributes: { exclude: ["password"] },
    });


    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "user not found",
      });
    }
      req.user = user

      next()
  } catch (error) {
       res.status(500).json({
        status: "error",
        message: "internal server error",
      });
  }
};

module.exports = protectRoute;
