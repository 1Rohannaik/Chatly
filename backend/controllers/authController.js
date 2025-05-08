const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const generateJWTToken = require("../src/utils");
const cloudinary = require("../src/cloudinary");

const singup = async (req, res) => {
  const { fullname, email, password } = req.body;

  try {
    if (!fullname || !email || !password) {
      res.status(400).json({
        status: "error",
        message: "all fields are required",
      });
    }
    if (password < 6) {
      res.status(400).json({
        status: "error",
        message: "password should consists of 6 letters",
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({
        status: "error",
        message: "email is already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateJWTToken(newUser.id, res);

      res.status(200).json({
        status: "error",
        message: "user created successfully",
        newUser: {
          id: newUser.id,
          fullname: newUser.fullname,
          email: newUser.email,
          profilePic: newUser.profilePic,
        },
      });
    }
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: "internal server error",
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(400).json({
        status: "error",
        message: "invalid credentials",
      });
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "invalid password",
      });
    }
    generateJWTToken(existingUser.id, res);

    return res.status(200).json({
      status: "success",
      message: "login in successfull",
      existingUser: {
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        profilePic: existingUser.profilePic,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
};

const signout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });// removing jwt from cookie 
    res.status(200).json({
      status: "successful",
      message: "loged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "loged out failed",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res
        .status(400)
        .json({ status: "error", message: "Profile picture is necessary" });
    }

    // Upload the file to Cloudinary
    cloudinary.uploader
      .upload_stream({ resource_type: "auto", folder: "profile_pics" },
        async (error, result) => {
          if (error) {
            return res
              .status(500)
              .json({ status: "error", message: "Failed to upload image" });
          }

          // Update user's profile picture URL in the database
          await User.update(
            { profilePic: result.secure_url },
            { where: { id: userId } }
          );

          res.status(200).json({
            status: "success",
            message: "Profile picture updated successfully",
            profilePic: result.secure_url,
          });
        }
      )
      .end(req.file.buffer); // Directly pipe the file buffer to Cloudinary
  } catch (error) {
    console.error("Error during profile update:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "internal server error",
    });
  }
};

module.exports = { singup, signin, signout, updateProfile, checkAuth };
