const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  const { email, password, confirmPassword, university, firstName } = req.body;
  try {

    // Create user in the database
    const user = await User.create({
      firstName,
      email,
      password,
      confirmPassword,
    });

    console.log("User created ");
    res.redirect("localhost:5173");
  } catch (error) {
    console.error("Cannot create user! ", error);
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    

    const payload = {
      id: user._id,
      firstName: user.firstName,
      role: 'user'
    };
    const token = jwt.sign(payload, "Decentralized", {
      expiresIn: "1h",
    });
    res.cookie("token", token, { httpOnly: true, secure: false });

    res.status(200).json({
      status: "success",
      data: {
        user: payload,
        token
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Function to send password reset email

// Function to reset user password

exports.getUserProfile = async (req, res) => {
  const user = await User.findOne({ email: req.user.email }); // Adjust based on your setup
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, university } = req.body;
    const userId = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { firstName, university } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "Error updating user profile", error });
  }
};

exports.logoutUser = (req, res, next) => {

  res.clearCookie('connect.sid', { path: '/' });
  res.clearCookie('token', { path: '/' });


  res.status(200).json({ message: "Logged out successfully" });
};

