const express = require("express");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const Comment = require("../models/comments");
const router = express.Router();

const {
  authorization,
  adminAuthorization,
} = require("../middleware/authorization");
const { validateId } = require("../utils/validator");

const addComment = async (req, res) => {
  try {
    let comment = await Comment.create({
      description: req.body.description,
      commented_by: req.userId,
      comment_date_time: new Date(),
    });

    let parentId = req.body.parentId;
    let parentType = req.body.parentType;

    if (!validateId(parentId)) {
      return res
        .status(400)
        .send({ status: 400, message: "Invalid parent id" });
    }

    let parentModel;
    if (parentType === "question") {
      parentModel = Question;
    } else if (parentType === "answer") {
      parentModel = Answer;
    } else {
      return res.status(400).send({ status: 400, message: "Invalid parent" });
    }

    let parentObject = await parentModel.exists({ _id: parentId });
    if (!parentObject) {
      return res.status(404).send({ status: 404, message: "Parent not found" });
    }

    await parentModel.findByIdAndUpdate(
      parentId,
      { $push: { comments: comment._id } },
      { new: true }
    );

    res.status(200).json({ status: 200, body: comment });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
};

const reportComment = async (req, res) => {
  try {
    let comment = await Comment.exists({ _id: req.body.cid });
    if (!comment) {
      return res
        .status(404)
        .send({ status: 404, message: "Comment not found" });
    }

    await Comment.findByIdAndUpdate(
      req.body.cid,
      { flag: true },
      { new: true }
    );
    res
      .status(200)
      .send({ status: 200, message: "Comment reported successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
};

const getReportedComments = async (req, res) => {
  try {
    let comments = await Comment.find({ flag: true }).populate({
      path: "commented_by",
      select: "username firstname lastname profilePic",
    });
    res.status(200).json(comments);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

const deleteComment = async (req, res) => {
  try {
    let comment = await Comment.exists({ _id: req.params.commentId });
    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    await Comment.findByIdAndDelete(req.params.commentId);
    res.status(200).send("Comment deleted successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

const resolveComment = async (req, res) => {
  try {
    let comment = await Comment.exists({ _id: req.params.commentId });
    if (!comment) {
      return res.status(404).send("Comment not found");
    }

    await Comment.findByIdAndUpdate(
      req.params.commentId,
      { flag: false },
      { new: true }
    );
    res.status(200).send("Comment resolved successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

router.get("/getReportedComments", authorization, getReportedComments);
router.post("/addComment", authorization, addComment);
router.post("/reportComment", authorization, reportComment);
router.delete("/deleteComment/:commentId", authorization, deleteComment);
router.post("/resolveComment/:commentId", adminAuthorization, resolveComment);

module.exports = router;
