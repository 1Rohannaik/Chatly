const User = require("../models/userModel");
const Message = require("../models/messageModel");
const cloudinary = require("../lib/cloudinary");
const streamifier = require("streamifier");
const { getReceiverSocketId, io } = require("../lib/socket"); 
const { Op } = require("sequelize");

const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user.id;

    const users = await User.findAll({
      where: {
        id: { [Op.ne]: loggedInUserId },
      },
      attributes: { exclude: ["password"] },
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user.id;

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
      },
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { message, imageUrl } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    // Validate message or image
    if (
      (!message || message.trim() === "") &&
      (!imageUrl || typeof imageUrl !== "string")
    ) {
      return res.status(400).json({ error: "Message or image is required." });
    }

    let uploadedImageUrl = null;

    // If imageUrl is provided, upload the image to Cloudinary
    if (imageUrl?.trim()) {
      const uploadImage = () => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "messages" },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error);
                return reject(error);
              }
              console.log("Cloudinary upload success:", result);
              resolve(result.secure_url); // Resolve with the secure URL
            }
          );

          const base64Data = imageUrl.split(",")[1]; // Extract base64 data
          if (!base64Data) return reject("Invalid base64 image data.");
          streamifier
            .createReadStream(Buffer.from(base64Data, "base64"))
            .pipe(uploadStream);
        });
      };

      uploadedImageUrl = await uploadImage(); // Wait for image URL to be returned
    }

    // Store the message in the database
    const newMessage = await Message.create({
      senderId,
      receiverId,
      message: message?.trim() || "",
      imageUrl: uploadedImageUrl || null, // Store the image URL (or null if no image)
    });

    // Get the socket ID of the receiver
    const receiverSocketId = await getReceiverSocketId(receiverId);

    // Emit the message to the receiver if they are connected
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage); // Emit to receiver
    }

    // Send the new message as the response
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage controller:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};




module.exports = {
  getUsersForSidebar,
  getMessages,
  sendMessage,
};
