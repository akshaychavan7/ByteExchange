const express = require("express");
const Tag = require("../models/tags");
const Question = require("../models/questions");

const router = express.Router();

const getTagsWithQuestionNumber = async (req, res) => {
  let questions = await Question.find({}).populate("tags");
  let tags = await Tag.find({});

  let resp = [];
  for (let tag of tags) {
    let count = 0;
    for (let question of questions) {
      for (let t of question.tags) {
        if (tag.name === t.name) {
          count += 1;
          break;
        }
      }
    }
    resp.push({ name: tag.name, qcnt: count });
  }

  res.json(resp);
};

// add appropriate HTTP verbs and their endpoints to the router.
router.get("/getTagsWithQuestionNumber", getTagsWithQuestionNumber);

module.exports = router;
