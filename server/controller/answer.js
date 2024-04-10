const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");

const router = express.Router();
const authorization = require("../middleware/authorization");

// Adding answer
const addAnswer = async (req, res) => {
  let answer = await Answer.create({
    ...req.body.ans,
    ans_by: req.userId,
    ans_date_time: new Date(),
  });
  res.status(200);
  let qid = req.body.qid;
  await Question.findOneAndUpdate(
    { _id: qid },
    { $push: { answers: { $each: [answer._id], $position: 0 } } },
    { new: true }
  );
  res.json(answer);
};

// add appropriate HTTP verbs and their endpoints to the router.
router.post("/addAnswer", authorization, addAnswer);

module.exports = router;
