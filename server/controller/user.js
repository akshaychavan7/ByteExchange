const express = require("express");
const User = require("../models/users");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const Comment = require("../models/comments");

const { preprocessing } = require("../utils/textpreprocess");

const { authorization } = require("../middleware/authorization");

const router = express.Router();

// get list of all users
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

const getUserDetails = async (req, res) => {
  try {
    let user = await User.findOne({
      username: preprocessing(req.params.username),
    });

    let questions = await Question.find({ asked_by: user._id })
    .populate({ path: "asked_by", select: "username -_id" })
    .populate("tags")
    .populate("answers")
    .populate("comments")
    .populate("upvoted_by")
    .populate("downvoted_by")
    .exec();


    let answers = await Answer.find({ ans_by: user._id })
    .populate({ path: "ans_by", select: "username -_id" })
    .populate("comments")
    .populate("upvoted_by")
    .populate("downvoted_by")
    .exec();

    let comments = await Comment.find({ commented_by: user._id })
    .populate({ path: "commented_by", select: "username -_id" })
    .populate("upvoted_by")
    .exec();



    let udetails = {
      username: user["username"],
      firstname: user["firstname"],
      lastname: user["lastname"],
      joiningDate: user["joiningDate"],
      profilePic: user["profilePic"],
      userRole: user["userRole"],
      reputation: user["reputation"],
      location: user["location"],
      technologies: user["technologies"],
      questions: questions,
      answers: answers,
      comments: comments,
    };
    res.status(200).json({ userDetails: udetails });
  } catch (err) {
    res.status(500).json({ error: `Error in fetching user details : ${err}` });
  }
};


router.post("/getUsersList", authorization, getUsersList);
router.get(
  "/getUserDetails/:username",
  authorization,
  getUserDetails
);

module.exports = router;
