const express = require("express");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const Comment = require("../models/comments");
const authorization = require("../middleware/authorization");
const User = require("../models/users");

const { removeUpvote, addUpvote } = require("../utils/comment");

const { preprocessing } = require("../utils/textpreprocess");

const router = express.Router();

// To add question comments to the database.
const addQuestionComment = async (req, res) => {
  try {
    let comment = req.body.comment;
    let qid = preprocessing(req.body.qid);
    const newcomment = await Comment.create({
      description: preprocessing(comment.description),
      commented_by: preprocessing(comment.commented_by),
      comment_date_time: preprocessing(comment.comment_date_time),
    });
    await Question.findOneAndUpdate(
      { _id: qid },
      { $push: { comments: { $each: [newcomment._id], $position: 0 } } },
      { new: true }
    );
    res.status(200).json(newcomment);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Comment could not be added for the question: ${err}` });
  }
};

// To add answer comments to the database.
const addAnswerComment = async (req, res) => {
  try {
    let comment = req.body.comment;
    let aid = preprocessing(req.body.aid);
    const newcomment = await Comment.create({
      description: preprocessing(comment.description),
      commented_by: preprocessing(comment.commented_by),
      comment_date_time: preprocessing(comment.comment_date_time),
    });
    await Answer.findOneAndUpdate(
      { _id: aid },
      { $push: { comments: { $each: [newcomment._id], $position: 0 } } },
      { new: true }
    );
    res.status(200).json(newcomment);
  } catch (err) {
    res
      .status(500)
      .json({ error: `Comment could not be added for the answer: ${err}` });
  }
};

// To upvote a answer
const upvoteComment = async (req, res) => {
  try {
    let cid = preprocessing(req.body.cid);
    let uid = preprocessing(req.userId);
    let user = await User.findOne({ _id: uid });
    if (!user) {
      res
        .status(401)
        .json({ error: `Unauthorized access: Unidentified userid.` });
    }
    let comment = await Comment.findOne({ _id: cid });
    if (!comment) {
      res
        .status(404)
        .json({ error: `Unavailable resource: Unidentified commentid.` });
    }
    // If the user id is in the upvote list, remove that and update count else upvote.
    const checkUserUpvote = comment.upvoted_by.includes(uid);
    if (checkUserUpvote) {
      removeUpvote(cid, uid);
      res
        .status(200)
        .json({ message: "Removed previous upvote of user", upvote: false });
    } else {
      addUpvote(cid, uid);
      res.status(200).json({ message: "Upvoted for the user", upvote: true });
    }
  } catch (err) {
    res
      .status(500)
      .json({ error: `Answer could not be upvoted at this time: ${err}` });
  }
};

// To get vote count of comment.
const getVoteCountComment = async (req, res) => {
  try {
    let cid = preprocessing(req.params.commentId);
    let comment = await Comment.findOne({ _id: cid });
    if (!comment) {
      res
        .status(404)
        .json({ error: `Unavailable resource: Unidentified commentid.` });
    }
    res.status(200).json({ vote_count: comment.vote_count });
  } catch (err) {
    res
      .status(500)
      .json({ error: `Cannot fetch vote count of comment: ${err}` });
  }
};

// To flag or unflag a comment
// Note: requires structural change for delete.
const flagComment = async (req, res) => {
  try {
    let uid = preprocessing(req.userId);
    let user = await User.findOne({ _id: uid });
    if (!user) {
      res
        .status(401)
        .json({ error: `Unauthorized access: Unidentified userid.` });
    }
    let comment = await Comment.findOne({ _id: preprocessing(req.body.cid) });
    if (!comment) {
      res
        .status(404)
        .json({ error: `Unavailable resource: Unidentified commentid.` });
    }
    comment.flag = !comment.flag;
    await comment.save();
    if (!comment.flag) {
      res.status(200).json({ message: "Unflagged comment from review." });
    } else {
      res.status(200).json({ message: "Flagged comment for review." });
    }
  } catch (err) {
    res.status(500).json({ error: `Cannot fetch flagged comment: ${err}` });
  }
};

// add appropriate HTTP verbs and their endpoints to the router.
router.post("/addQuestionComment", addQuestionComment);
router.post("/addAnswerComment", addAnswerComment);
router.post("/upvoteComment", authorization, upvoteComment);
router.get("/getVoteCountComment/:commentId", getVoteCountComment);
router.post("/flagComment", authorization, flagComment);

module.exports = router;
