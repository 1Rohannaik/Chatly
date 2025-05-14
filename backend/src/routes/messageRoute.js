const express = require("express");
const { protectRoute } = require("../middleware/authMiddleware.js");
const {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} = require("../controllers/messageController.js");

const router = express.Router();

// Get list of users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get messages for a specific user (ID)
router.get("/:id", protectRoute, getMessages);

// Send a message to a specific user (ID)
router.post("/send/:id", protectRoute, sendMessage); 

module.exports = router;
