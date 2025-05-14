const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expiration time
  });

  // Set the cookie with appropriate flags based on environment
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    httpOnly: true, // Prevent access to the cookie from JavaScript
    sameSite: "None", // Allow cross-origin requests in production
    secure: process.env.NODE_ENV === "production", // Ensure secure cookies in production
  });

  return token;
};

module.exports = { generateToken };
