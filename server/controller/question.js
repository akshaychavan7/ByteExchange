const express = require("express");
const Question = require("../models/questions");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
  getTop10Questions,
} = require("../utils/question");

const router = express.Router();
const {
  authorization,
  adminAuthorization,
} = require("../middleware/authorization");
const { preprocessing } = require("../utils/textpreprocess");

// To get Questions by Filter
const getQuestionsByFilter = async (req, res) => {
  try {
    let questions = await getQuestionsByOrder(req.query.order);
    questions = filterQuestionsBySearch(questions, req.query.search);

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).send({  details: error.message, message: "Internal Server Error" });
  }
};

// To get Questions by Id
const getQuestionById = async (req, res) => {
  try {
    let qid = preprocessing(req.params.questionId);
    let question = await Question.findOneAndUpdate(
      { _id: qid },
      { $inc: { views: 1 } },
      { new: true }
    )
      .populate([
        {
          path: "answers",
          populate: [
            {
              path: "ans_by",
              select: "username firstname lastname profilePic",
            },
            {
              path: "comments",
              populate: {
                path: "commented_by",
                select: "username firstname lastname profilePic",
              },
            },
          ],
          options: { sort: { vote_count: -1 } },
        },
        { path: "asked_by", select: "-password" },
        { path: "tags" },
        {
          path: "comments",
          populate: {
            path: "commented_by",
            select: "username firstname lastname profilePic",
          },
          //sort by votes
          options: { sort: { vote_count: -1 } },
        },
      ])
      .exec();
    let jsonQuestion = question.toJSON();  
    jsonQuestion = showQuesUpDown(req.userId, jsonQuestion);
    res.status(200).json(jsonQuestion);
  } catch (err) {
    res.status(500);
    res.json({ error: "Something went wrong", details: err.message });
  }
};


const showQuesUpDown = (uid, question) => {
  question.upvote = false;
  question.downvote = false;
  let ques_upvoteBy = question["upvoted_by"].map((objectId) =>
    objectId.toString()
  );
  let ques_downvoteBy = question["downvoted_by"].map((objectId) =>
    objectId.toString()
  );
  if (ques_upvoteBy.includes(uid)) {
    question.upvote = true;
  } else if (ques_downvoteBy.includes(uid)) {
    question.downvote = true;
  }
  question["answers"] = showAnsUpDown(uid, question["answers"]);
  question["comments"] = showCommentUpDown(uid, question["comments"]);
  return question;
};

const showAnsUpDown = (uid, answers) => {
  for (let answer in answers) {
    answers[answer].upvote = false;
    answers[answer].downvote = false;
    let ans_upvoteBy = answers[answer]["upvoted_by"].map((objectId) =>
      objectId.toString()
    );
    let ans_downvoteBy = answers[answer]["downvoted_by"].map((objectId) =>
      objectId.toString()
    );
    if (ans_upvoteBy.includes(uid)) {
      answers[answer].upvote = true;
    } else if (ans_downvoteBy.includes(uid)) {
      answers[answer].downvote = true;
    }
    answers[answer]["comments"] = showCommentUpDown(
      uid,
      answers[answer]["comments"]
    );
  }
  return answers;
};

const showCommentUpDown = (uid, comments) => {
  for (let comment in comments) {
    comments[comment].upvote = false;
    comments[comment].downvote = false;
    let com_upvoteBy = comments[comment]["upvoted_by"].map((objectId) =>
      objectId.toString()
    );
    if (com_upvoteBy.includes(uid)) {
      comments[comment].upvote = true;
    }
  }
  return comments;
};


// To add Question
const addQuestion = async (req, res) => {
  if(req.body.tags.length > 5){
    return res.status(400).json({ message: "Maximum 5 tags are allowed" });
  }
  let tags = await Promise.all(
    req.body.tags.map(async (tag) => {
      return await addTag(tag);
    })
  );

  let question = await Question.create({
    title: req.body.title,
    description: req.body.description,
    asked_by: req.userId,
    tags: tags,
  });
  res.json(question);
};

const reportQuestion = async (req, res) => {
  try {
    console.log(req.body);
    let question = await Question.exists({ _id: req.body.qid });
    if (!question) {
      return res.status(404).send({ message: "Question not found" });
    }

    await Question.findByIdAndUpdate(
      req.body.qid,
      { flag: true },
      { new: true }
    );
    res
      .status(200)
      .send({ message: "Question reported successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getReportedQuestions = async (req, res) => {
  try {
    let questions = await Question.find({ flag: true }).populate({
      path: "asked_by",
      select: "username firstname lastname profilePic",
    });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    let question = await Question.exists({ _id: req.params.questionId });
    if (!question) {
      return res.status(404).send({ message: "Question not found" });
    }


    await Question.findByIdAndDelete(req.params.questionId);
    res.status(200).send({
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

const getTrendingQuestions = async (req, res) => {
  try {
    let questions = await getTop10Questions();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: `Internal Server Error`, details: err.message});
  }
};

const resolveQuestion = async (req, res) => {
  try {
    let question = await Question.exists({ _id: req.params.questionId });
    if (!question) {
      return res.status(404).send({ message: "Question not found" });
    }

    await Question.findByIdAndUpdate(
      req.params.questionId,
      { flag: false },
      { new: true }
    );
    res.status(200).send({ message: "Question resolved successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
};

// add appropriate HTTP verbs and their endpoints to the router

router.get("/getQuestion", authorization, getQuestionsByFilter);
router.get(
  "/getQuestionById/:questionId",
  authorization,
  authorization,
  getQuestionById
);
router.get("/getReportedQuestions", adminAuthorization, getReportedQuestions);
router.post("/addQuestion", authorization, addQuestion);
router.post("/reportQuestion/", authorization, reportQuestion);
router.post(
  "/resolveQuestion/:questionId",
  adminAuthorization,
  resolveQuestion
);
router.delete("/deleteQuestion/:questionId", adminAuthorization, deleteQuestion);
router.get("/getTrendingQuestions", getTrendingQuestions);

module.exports = router;
