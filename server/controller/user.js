const express = require("express");
const User = require("../models/users");
const router = express.Router();
const authorization = require("../middleware/authorization");

// Adding answer
const getUsersList = async (req, res) => {
  let usersList = await User.find({});
  // remove password from the response
  usersList = usersList.map((user) => {
    return {
      username: user.username,
      name: user.firstname + " " + user.lastname,
      profilePic: user.profilePic,
      location: user.location,
      technologies: user.technologies,
    };
  });
  res.json(usersList);
};

// add appropriate HTTP verbs and their endpoints to the router.
router.post("/getUsersList", authorization, getUsersList);

module.exports = router;
