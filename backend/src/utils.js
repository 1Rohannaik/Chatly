const jwt = require("jsonwebtoken")
require("dotenv").config();

const secreatKey = process.env.JWT_SECREAT;
const expiresIn = process.env.JWT_EXPIRES;

const generateJWTToken = (userId, res) => {
    const token = jwt.sign({ userId }, secreatKey, { expiresIn });
    
    res.cookie("jwt", token, {
      maxAge:7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      httpOnly: true,
      secure:process.env.NODE_ENV !=="development"
    });
    
}

module.exports = generateJWTToken;