const bcrypt = require("bcryptjs");
const { generateToken } = require("../lib/utils");
const cloudinary = require("../lib/cloudinary")
const User = require("../models/userModel");
const { Readable } = require("stream");

 // Ensure bcrypt is imported

const signup = async (req, res) => {
  const { fullName, email, password, profilePic } = req.body; // Include profilePic if it's part of the request
  try {
    // Validate inputs
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      profilePic: profilePic || null, // Handle profilePic if provided, otherwise set it to null
    });

    // If the user is successfully created, generate the token
    if (newUser) {
      // Assuming generateToken is a separate function you wrote
      generateToken(newUser.id, res);

      return res.status(201).json({
        id: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic || null, // Return profilePic if it's set
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in signup controller:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


// LOGIN
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    generateToken(user.id, res);

    res.status(200).json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// LOGOUT
const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// UPDATE PROFILE
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const streamUpload = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "profile_pics" },
          (error, result) => {
            if (error) {
              return reject(error);
            }
            resolve(result);
          }
        );

        const readableStream = new Readable();
        readableStream.push(fileBuffer);
        readableStream.push(null);
        readableStream.pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    await User.update(
      { profilePic: result.secure_url },
      { where: { id: userId } }
    );

    return res.status(200).json({
      status: "success",
      message: "Profile picture updated successfully",
      profilePic: result.secure_url,
    });
  } catch (error) {
    console.error("Error during profile update:", error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};


// CHECK AUTH
const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
};


