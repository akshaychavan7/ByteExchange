const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const User = require("../models/users");

const { SECRET_KEY } = require("../config");

const router = express.Router();

// validate crentials of the user
const authenticateCredentials = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    SECRET_KEY,
    { expiresIn: "1d" }
  );

  return res
    .cookie("access_token", token, {
      httpOnly: true,
      secure: true,
    })
    .status(200)
    .json({ status: 200, message: "Logged In Successfully" });
};

const registerUser = async (req, res) => {
  const { username, password } = req.body;
  // check if user already exists
  const existing = await User.findOne({ username });
  if (existing) {
    return res.status(400).json({ message: "User already exists" });
  } else {
    const user = new User({ username, password });
    await user.save();
    res
      .status(200)
      .json({ status: 200, message: "User registered successfully" });
  }
};

// add appropriate HTTP verbs and their endpoints to the router

router.post("/authenticate", authenticateCredentials);
router.post("/register", registerUser);
module.exports = router;
