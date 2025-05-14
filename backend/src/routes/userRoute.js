const express = require("express");
const {
  checkAuth,
  login,
  logout,
  signup,
  updateProfile,
} = require("../controllers/authController");
const { protectRoute } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware")

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),
  updateProfile
);

router.get("/check", protectRoute, checkAuth);

module.exports = router;
