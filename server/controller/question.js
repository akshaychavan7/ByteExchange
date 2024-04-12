const express = require("express");
const Question = require("../models/questions");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
} = require("../utils/question");

const router = express.Router();
const authorization = require("../middleware/authorization");

// To get Questions by Filter
const getQuestionsByFilter = async (req, res) => {
  try {
    let questions = await getQuestionsByOrder(req.query.order);
    questions = filterQuestionsBySearch(questions, req.query.search);

    res.status(200).json(questions);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

// To get Questions by Id
const getQuestionById = async (req, res) => {
  try {
    let question = await Question.findOneAndUpdate(
      { _id: req.params.questionId },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate({
        path: "answers",
        populate: {
          path: "ans_by",
          select: "username firstname lastname profilePic",
        },
      })
      .populate({
        path: "answers",
        populate: {
          path: "comments",
          populate: {
            path: "commented_by",
            select: "username firstname lastname profilePic",
          },
        },
      })
      .populate("asked_by")
      .populate("comments");
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
    description: req.body.description,
    asked_by: req.userId,
    ask_date_time: new Date(),
    tags: tags,
  });
  res.json(question);
};

// add appropriate HTTP verbs and their endpoints to the router

router.get("/getQuestion", authorization, getQuestionsByFilter);
router.get("/getQuestionById/:questionId", getQuestionById);
router.post("/addQuestion", authorization, addQuestion);

module.exports = router;
