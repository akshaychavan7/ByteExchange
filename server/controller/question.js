const express = require("express");
const Question = require("../models/questions");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");

const router = express.Router();

// To get Questions by Filter
const getQuestionsByFilter = async (req, res) => {
  try {
    let qList = await getQuestionsByOrder(req.query.order);

    let filteredQuestionsList = filterQuestionsBySearch(
      qList,
      req.query.search
    );
    res.status(200);
    res.json(filteredQuestionsList);
  } catch (err) {
    res.json({ error: "Something went wrong", details: err.message });
  }
};

// To get Questions by Id
const getQuestionById = async (req, res) => {
  try {
    let question = await Question.findOneAndUpdate(
      { _id: req.params.questionId },
      { $inc: { views: 1 } },
      { new: true }
    ).populate("answers");
    res.status(200);
    res.json(question);
  } catch (err) {
    res.status(500);
    res.json({});
  }
};

// To add Question
const addQuestion = async (req, res) => {
  let tags = await Promise.all(
    req.body.tags.map(async (tag) => {
      return await addTag(tag);
    })
  );
  let question = await Question.create({
    title: req.body.title,
    text: req.body.text,
    asked_by: req.body.asked_by,
    ask_date_time: req.body.ask_date_time,
    tags: tags,
  });
  res.json(question);
};

// add appropriate HTTP verbs and their endpoints to the router

router.get("/getQuestion", getQuestionsByFilter);
router.get("/getQuestionById/:questionId", getQuestionById);
router.post("/addQuestion", addQuestion);

module.exports = router;
