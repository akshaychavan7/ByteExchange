const express = require("express");
const Answer = require("../models/answers");
const Question = require("../models/questions");

const router = express.Router();
const {
  authorization,
  adminAuthorization,
} = require("../middleware/authorization");

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

const reportAnswer = async (req, res) => {
  try {
    let answer = await Answer.exists({ _id: req.body.aid });
    if (!answer) {
      return res.status(404).send({ status: 404, message: "Answer not found" });
    }

    await Answer.findByIdAndUpdate(req.body.aid, { flag: true }, { new: true });
    res.status(200).send({ status: 200, message: "Answer reported" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
};

const getReportedAnswers = async (req, res) => {
  try {
    let answers = await Answer.find({ flag: true });
    res.status(200).json(answers);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send({ status: 500, message: "Internal Server Error" });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    let answer = await Answer.exists({ _id: req.params.answerId });
    if (!answer) {
      return res.status(404).send("Answer not found");
    }

    await Answer.findByIdAndDelete(req.params.answerId);
    res.status(200).send("Answer deleted successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
}

const resolveAnswer = async (req, res) => {
  try {
    let answer = await Answer.exists({ _id: req.params.answerId });
    if (!answer) {
      return res.status(404).send("Answer not found");
    }

    await Answer.findByIdAndUpdate(
      req.params.answerId,
      { flag: false },
      { new: true }
    );
    res.status(200).send("Answer resolved successfully");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};



// add appropriate HTTP verbs and their endpoints to the router.
router.get("/getReportedAnswers", adminAuthorization, getReportedAnswers);
router.post("/addAnswer", authorization, addAnswer);
router.post("/reportAnswer/", authorization, reportAnswer);
router.post("/resolveAnswer/:answerId", adminAuthorization, resolveAnswer);
router.delete("/deleteAnswer/:answerId", adminAuthorization, deleteAnswer);

module.exports = router;
