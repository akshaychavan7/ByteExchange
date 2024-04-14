const express = require("express");
const Comment = require("../models/comments");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const router = express.Router();
const { authorization } = require("../middleware/authorization");
const { validateId } = require("../utils/validator");

const upvote = async (req, res) => {
  try {
    var voteObject;
    var id = req.body.id;
    var voteType = req.body.type;

    if (!validateId(id)) {
      return res.status(400).send({ status: 400, message: "Invalid id" });
    }

    switch (voteType) {
      case "question":
        voteObject = await Question;
        break;
      case "answer":
        voteObject = await Answer;
        break;
      case "comment":
        voteObject = await Comment;
        break;
      default:
        return res.status(400).send({ status: 400, message: "Invalid type" });
    }

    const obj = await voteObject.findById(id);
    if (!obj) {
      return res.status(404).send({ status: 404, message: "Object not found" });
    }

    if (obj.upvoted_by.includes(req.userId)) {
      return res.status(200).send("User already upvoted");
    } else if (obj.downvoted_by.includes(req.userId)) {
      await voteObject.findByIdAndUpdate(id, {
        $pull: { downvoted_by: req.userId },
        $addToSet: { upvoted_by: req.userId },
        $inc: { vote_count: 2 },
      });
    } else {
      await voteObject.findByIdAndUpdate(id, {
        $addToSet: { upvoted_by: req.userId },
        $inc: { vote_count: 1 },
      });
    }

    res.status(200).send({ status: 200, message: "Upvoted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
};

const downvote = async (req, res) => {
  try {
    var voteObject;
    var id = req.body.id;
    var voteType = req.body.type;

    if (!validateId(id)) {
      return res.status(400).send({ status: 400, message: "Invalid id" });
    }

    switch (voteType) {
      case "question":
        voteObject = await Question;
        break;
      case "answer":
        voteObject = await Answer;
        break;
      case "comment":
        voteObject = await Comment;
        break;
      default:
        throw new Error("Invalid type");
    }

    const obj = await voteObject.findById(id);
    if (!obj) {
      return res.status(404).send({ status: 404, message: "Object not found" });
    }

    if (obj.downvoted_by.includes(req.userId)) {
      return res.status(200).send("User already downvoted");
    } else if (obj.upvoted_by.includes(req.userId)) {
      await voteObject.findByIdAndUpdate(id, {
        $pull: { upvoted_by: req.userId },
        $addToSet: { downvoted_by: req.userId },
        $inc: { vote_count: -2 },
      });
    } else {
      await voteObject.findByIdAndUpdate(id, {
        $addToSet: { downvoted_by: req.userId },
        $inc: { vote_count: -1 },
      });
    }

    res.status(200).send({ status: 200, message: "Downvoted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
};

router.post("/upvote", authorization, upvote);
router.post("/downvote", authorization, downvote);

module.exports = router;
