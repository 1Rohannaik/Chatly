const {
  singup,
  signin,
  signout,
  updateProfile,
  checkAuth,
} = require("../controllers/authController");
const express = require("express");
const router = express.Router();
const protectRoute = require("../middleware/authMiddelware")
const upload = require("../middleware/uploadMiddleware")


router.post("/signup", singup);
router.post("/signin", signin);
router.post("/signout", signout);
router.put(
  "/update-profile",
  protectRoute,
  upload.single("profilePic"),//we are uploading single profile pic
  updateProfile
);
router.get("/check", protectRoute, checkAuth); // after refreshig we will check the user is authonticated or not






module.exports = router;