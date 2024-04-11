const Tag = require("../models/tags");
const Question = require("../models/questions");

const addTag = async (tname) => {
  const data = await Tag.findOne({ name: tname });
  if (!data) {
    const tag = new Tag({ name: tname });
    const savedTag = await tag.save();

    return savedTag._id;
  } else {
    return data._id;
  }
};

const getQuestionsByOrder = async (order) => {
  let questions = await Question.find()
    .populate("tags")
    .populate("answers")
    .populate({
      path: "asked_by",
    });

  questions.sort((a, b) => b.ask_date_time - a.ask_date_time);
  if (order == "active") {
    questions.sort((a, b) => {
      const latestAnsDateTimeA =
        a.answers.length > 0
          ? a.answers.reduce((latest, answer) => {
              return answer.ans_date_time > latest
                ? answer.ans_date_time
                : latest;
            }, new Date(0))
          : new Date(0);

      const latestAnsDateTimeB =
        b.answers.length > 0
          ? b.answers.reduce((latest, answer) => {
              return answer.ans_date_time > latest
                ? answer.ans_date_time
                : latest;
            }, new Date(0))
          : new Date(0);

      return latestAnsDateTimeB - latestAnsDateTimeA;
    });
  } else if (order == "unanswered") {
    questions = questions.filter((q) => q.answers.length == 0);
  }

  // delete password from all questions
  questions = questions.map((q) => {
    q.asked_by.password = undefined;
    return q;
  });

  return questions;
};

const filterQuestionsBySearch = (qlist, search) => {
  let searchTags = parseTags(search);
  let searchKeyword = parseKeyword(search);
  const res = qlist.filter((q) => {
    if (searchKeyword.length == 0 && searchTags.length == 0) {
      return true;
    } else if (searchKeyword.length == 0) {
      return checkTagInQuestion(q, searchTags);
    } else if (searchTags.length == 0) {
      return checkKeywordInQuestion(q, searchKeyword);
    } else {
      return (
        checkKeywordInQuestion(q, searchKeyword) ||
        checkTagInQuestion(q, searchTags)
      );
    }
  });

  return res;
};

const parseTags = (search) => {
  return (search.match(/\[([^\]]+)\]/g) || []).map((word) => word.slice(1, -1));
};

const parseKeyword = (search) => {
  return search.replace(/\[([^\]]+)\]/g, " ").match(/\b\w+\b/g) || [];
};

const checkTagInQuestion = (question, searchTags) => {
  return searchTags.some((tag) =>
    question.tags.some((t) => t.name?.toLowerCase() === tag.toLowerCase())
  );
};

const checkKeywordInQuestion = (question, searchKeyword) => {
  return searchKeyword.every(
    (word) =>
      question.text?.toLowerCase().includes(word.toLowerCase()) ||
      question.title?.toLowerCase().includes(word.toLowerCase())
  );
};

module.exports = { addTag, getQuestionsByOrder, filterQuestionsBySearch };
