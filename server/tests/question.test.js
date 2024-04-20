// Unit tests for utils/question.js
const mockingoose = require("mockingoose");
const Tag = require("../models/tags");
const Question = require("../models/questions");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
  getTop10Questions,
  showQuesUpDown
} = require("../utils/question");
Question.schema.path("answers", Array);

const _tag1 = {
  _id: "507f191e810c19729de860ea",
  name: "react",
};
const _tag2 = {
  _id: "65e9a5c2b26199dbcc3e6dc8",
  name: "javascript",
};
const _tag3 = {
  _id: "65e9b4b1766fca9451cba653",
  name: "android",
};
const _ans1 = {
  _id: "65e9b58910afe6e94fc6e6dc",
  description: "ans1",
  ans_by: "ans_by1",
  ans_date_time: new Date("2023-11-18T09:24:00"),
};

const _ans2 = {
  _id: "65e9b58910afe6e94fc6e6dd",
  description: "ans2",
  ans_by: "ans_by2",
  ans_date_time: new Date("2023-11-20T09:24:00"),
};

const _ans3 = {
  _id: "65e9b58910afe6e94fc6e6de",
  description: "ans3",
  ans_by: "ans_by3",
  ans_date_time: new Date("2023-11-19T09:24:00"),
};

const _ans4 = {
  _id: "65e9b58910afe6e94fc6e6df",
  description: "ans4",
  ans_by: "ans_by4",
  ans_date_time: new Date("2023-11-19T09:24:00"),
};

const _questions = [
  {
    _id: "65e9b58910afe6e94fc6e6dc",
    title: "Quick question about storage on android",
    description: "I would like to know the best way to go about storing an array on an android phone so that even when the app/activity ended the data remains",
    tags: [_tag3, _tag2],
    answers: [_ans1, _ans2],
    ask_date_time: new Date("2023-11-16T09:24:00"),
  },
  {
    _id: "65e9b5a995b6c7045a30d823",
    title: "Object storage for a web application",
    description: "I am currently working on a website where, roughly 40 million documents and images should be served to its users. I need suggestions on which method is the most suitable for storing content with subject to these requirements.",
    tags: [_tag1, _tag2],
    answers: [_ans1, _ans2, _ans3],
    ask_date_time: new Date("2023-11-17T09:24:00"),
  },
  {
    _id: "65e9b9b44c052f0a08ecade0",
    title: "Is there a language to write programmes by pictures?",
    description: "Does something like that exist?",
    tags: [],
    answers: [],
    ask_date_time: new Date("2023-11-19T09:24:00"),
  },
  {
    _id: "65e9b716ff0e892116b2de09",
    title: "Unanswered Question #2",
    description: "Does something like that exist?",
    tags: [],
    answers: [],
    ask_date_time: new Date("2023-11-20T09:24:00"),
  },
];

describe("question util module", () => {
  beforeEach(() => {
    mockingoose.resetAll();
  });

  // addTag
  test("addTag return tag id if the tag already exists", async () => {
    mockingoose(Tag).toReturn(_tag1, "findOne");

    const result = await addTag("react");
    expect(result.toString()).toEqual(_tag1._id);
  });

  test("addTag return tag id of new tag if does not exist in database", async () => {
    mockingoose(Tag).toReturn(null, "findOne");
    mockingoose(Tag).toReturn(_tag2, "save");

    const result = await addTag("javascript");
    expect(result.toString()).toEqual(_tag2._id);
  });

  test("addTag return error if error occurs while adding tag", async () => {
    mockingoose(Tag).toReturn(null, "findOne");
    mockingoose(Tag).toReturn(new Error("Could not add tag. "), "save");

    const result = await addTag("javascript");
    expect(result).toEqual(Error("Could not add tag. "));
  });

  // filterQuestionsBySearch
  test("filter question empty string", () => {
    const result = filterQuestionsBySearch(_questions, "");

    expect(result.length).toEqual(4);
  });

  test("filter question by one tag", () => {
    const result = filterQuestionsBySearch(_questions, "[android]");

    expect(result.length).toEqual(1);
    expect(result[0]._id).toEqual("65e9b58910afe6e94fc6e6dc");
  });

  test("filter question by multiple tags", () => {
    const result = filterQuestionsBySearch(_questions, "[android] [react]");

    expect(result.length).toEqual(2);
    expect(result[0]._id).toEqual("65e9b58910afe6e94fc6e6dc");
    expect(result[1]._id).toEqual("65e9b5a995b6c7045a30d823");
  });

  test("filter question by one keyword", () => {
    const result = filterQuestionsBySearch(_questions, "website");

    expect(result.length).toEqual(1);
    expect(result[0]._id).toEqual("65e9b5a995b6c7045a30d823");
  });

  test("filter question by tag and keyword", () => {
    const result = filterQuestionsBySearch(_questions, "website [android]");

    expect(result.length).toEqual(2);
    expect(result[0]._id).toEqual("65e9b58910afe6e94fc6e6dc");
    expect(result[1]._id).toEqual("65e9b5a995b6c7045a30d823");
  });

  test("get top 10 questions", async () => {
    mockingoose(Question).toReturn(_questions, "find");

    const result = await getTop10Questions();
    expect(result.length).toEqual(4);
    expect(result[0]._id.toString()).toEqual("65e9b58910afe6e94fc6e6dc");
    expect(result[1]._id.toString()).toEqual("65e9b5a995b6c7045a30d823");
    expect(result[2]._id.toString()).toEqual("65e9b9b44c052f0a08ecade0");
    expect(result[3]._id.toString()).toEqual("65e9b716ff0e892116b2de09");
  });
  
  // getQuestionsByOrder
  test("get active questions, newest questions sorted by most recently answered 1", async () => {
    mockingoose(Question).toReturn(_questions.slice(0, 3), "find");

    const result = await getQuestionsByOrder("active");
    expect(result.length).toEqual(3);
    expect(result[0]._id.toString()).toEqual("65e9b5a995b6c7045a30d823");
    expect(result[1]._id.toString()).toEqual("65e9b58910afe6e94fc6e6dc");
    expect(result[2]._id.toString()).toEqual("65e9b9b44c052f0a08ecade0");
  });

  test("get active questions, newest questions sorted by most recently answered 2", async () => {
    const questions = [
      {
        _id: "65e9b716ff0e892116b2de01",
        answers: [_ans1, _ans3], // 18, 19 => 19
        ask_date_time: new Date("2023-11-20T09:24:00"),
      },
      {
        _id: "65e9b716ff0e892116b2de02",
        answers: [_ans1, _ans2, _ans3, _ans4], // 18, 20, 19, 19 => 20
        ask_date_time: new Date("2023-11-20T09:24:00"),
      },
      {
        _id: "65e9b716ff0e892116b2de03",
        answers: [_ans1], // 18 => 18
        ask_date_time: new Date("2023-11-19T09:24:00"),
      },
      {
        _id: "65e9b716ff0e892116b2de04",
        answers: [_ans4], // 19 => 19
        ask_date_time: new Date("2023-11-21T09:24:00"),
      },
      {
        _id: "65e9b716ff0e892116b2de05",
        answers: [],
        ask_date_time: new Date("2023-11-19T10:24:00"),
      },
    ];
    mockingoose(Question).toReturn(questions, "find");

    const result = await getQuestionsByOrder("active");

    expect(result.length).toEqual(5);
    expect(result[0]._id.toString()).toEqual("65e9b716ff0e892116b2de02");
    expect(result[1]._id.toString()).toEqual("65e9b716ff0e892116b2de04");
    expect(result[2]._id.toString()).toEqual("65e9b716ff0e892116b2de01");
    expect(result[3]._id.toString()).toEqual("65e9b716ff0e892116b2de03");
    expect(result[4]._id.toString()).toEqual("65e9b716ff0e892116b2de05");
  });

  test("get newest unanswered questions", async () => {
    mockingoose(Question).toReturn(_questions, "find");

    const result = await getQuestionsByOrder("unanswered");
    expect(result.length).toEqual(2);
    expect(result[0]._id.toString()).toEqual("65e9b716ff0e892116b2de09");
    expect(result[1]._id.toString()).toEqual("65e9b9b44c052f0a08ecade0");
  });

  test("get newest questions", async () => {
    const questions = [
      {
        _id: "65e9b716ff0e892116b2de01",
        ask_date_time: new Date("2023-11-20T09:24:00"),
      },
      {
        _id: "65e9b716ff0e892116b2de04",
        ask_date_time: new Date("2023-11-21T09:24:00"),
      },
      {
        _id: "65e9b716ff0e892116b2de05",
        ask_date_time: new Date("2023-11-19T10:24:00"),
      },
    ];
    mockingoose(Question).toReturn(questions, "find");

    const result = await getQuestionsByOrder("newest");
    expect(result.length).toEqual(3);
    expect(result[0]._id.toString()).toEqual("65e9b716ff0e892116b2de04");
    expect(result[1]._id.toString()).toEqual("65e9b716ff0e892116b2de01");
    expect(result[2]._id.toString()).toEqual("65e9b716ff0e892116b2de05");
  });

  test("get Questions By Order return error if error occurs while fetching questions", async () => {
    mockingoose(Question).toReturn(new Error("Could not fetch questions. "), "find");

    const result = await getQuestionsByOrder("active");
    expect(result).toEqual(Error("Error in extracting questions: Error: Could not fetch questions. "));
  });

  test("showQuesUpDown return questions with upvotes and downvotes", async () => {
    const questions = [
      {
        _id: "65e9b716ff0e892116b2de01",
        upvoted_by: ["user1", "user2"],
        downvoted_by: ["user3"],
      },
      {
        _id: "65e9b716ff0e892116b2de02",
        upvoted_by: ["user1"],
        downvoted_by: ["user2", "user3"],
      },
      {
        _id: "65e9b716ff0e892116b2de03",
        upvoted_by: [],
        downvoted_by: [],
      },
    ];
    mockingoose(Question).toReturn(questions, "find");

    const result = await showQuesUpDown();
    expect(result.length).toEqual(3);
    expect(result[0]._id.toString()).toEqual("65e9b716ff0e892116b2de01");
    expect(result[0].upvoted_by).toEqual(2);
    expect(result[0].downvoted_by).toEqual(1);
    expect(result[1]._id.toString()).toEqual("65e9b716ff0e892116b2de02");
    expect(result[1].upvoted_by).toEqual(1);
    expect(result[1].downvoted_by).toEqual(2);
    expect(result[2]._id.toString()).toEqual("65e9b716ff0e892116b2de03");
    expect(result[2].upvoted_by).toEqual(0);
    expect(result[2].downvoted_by).toEqual(0);
  });

});


// describe("showQuesUpDown", () => {
//   test("showQuesUpDown should respond correctly", () => {
//     const q = {
//       "_id": "662442c6f504c5166b9c6056",
//       "title": "test",
//       "description": "test description",
//       "asked_by": {},
//       "views": 1,
//       "tags": ["tag1"],
//       "answers": [],
//       "comments": [],
//       "vote_count": -1,
//       "upvoted_by": [],
//       "downvoted_by": ["6622f5d28b534861b8fe7272"],
//       "flag": false,
//       "ask_date_time": "2024-04-20T22:33:42.075Z",
//       "__v": 0,
//       "upvote": false,
//       "downvote": false
//     }

//     const result = showQuesUpDown("6622f5d28b534861b8fe7272", q)

//     expect({...q, upvote: false, downvote: true}).toEqual(result)
//   })
// });