// unit tests for functions in controller/question.js

const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Question = require("../models/questions");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
  showQuesUpDown,
  getTop10Questions
} = require("../utils/question");

jest.mock("../models/questions");
jest.mock("../utils/question", () => ({
  addTag: jest.fn(),
  getQuestionsByOrder: jest.fn(),
  filterQuestionsBySearch: jest.fn(),
  showQuesUpDown: jest.fn(),
  getTop10Questions: jest.fn(),
}));

let server;
let moderatorCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjQ5MDJiNDVjNGEwNjk3NWM4MmEiLCJ1c2VybmFtZSI6Im1vZGVyYXRvciIsInVzZXJSb2xlIjoibW9kZXJhdG9yIiwiaWF0IjoxNzEzNjUzODMyfQ.cp7VPqo7Lp6z7THvvxqA2FBSvl0bGrZF9D5CX7cl2uU; Expires=Wed, 30 May 2300 12:30:00 GMT; Path=/; Secure; HttpOnly"
let moderatorUserId = "6622f4902b45c4a06975c82a"
let generalCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjVkMjhiNTM0ODYxYjhmZTcyNzIiLCJ1c2VybmFtZSI6ImdlbmVyYWwiLCJ1c2VyUm9sZSI6ImdlbmVyYWwiLCJpYXQiOjE3MTM2NTQwMTcsImV4cCI6MTcxMzc0MDQxN30.XBKevPMMmyLX_u3o_xMoPRTkG9OH6702EIcf6Th-CR8; Expires=Mon, 17 Dec 2300 08:24:00 GMT; Path=/; Secure; HttpOnly"
let generalUserId = "6622f5d28b534861b8fe7272"



const tag1 = {
  _id: "507f191e810c19729de860ea",
  name: "tag1",
};
const tag2 = {
  _id: "65e9a5c2b26199dbcc3e6dc8",
  name: "tag2",
};

const ans1 = {
  _id: "65e9b58910afe6e94fc6e6dc",
  text: "Answer 1 Text",
  ans_by: "answer1_user",
};

const ans2 = {
  _id: "65e9b58910afe6e94fc6e6dd",
  text: "Answer 2 Text",
  ans_by: "answer2_user",
};


const comment1 = {
  _id: "65e9b58910afe6e94fc6e6de",
  description: "Comment 1 Description",
  commented_by: "comment1_user",
};

const comment2 = {
  _id: "6wfwefwefwefwefwefwefwef",
  description: "Comment 2 Description",
  commented_by: "comment2_user",
};


const user1 = {
  _id: "6523r23r23r23r23r23r23r",
  username: "SomeUser1",
  password: "SomePassword1",
  firstname: "SomeFirstName1",
  lastname: "SomeLastName1",
  userRole: "general",
  technologies: ["React"],
  location: "Boston, MA",
  reputation: 0,
};

const user2 = {
  _id: "6523r23r23r23r23r23r23s",
  username: "SomeUser2",
  password: "SomePassword2",
  firstname: "SomeFirstName2",
  lastname: "SomeLastName2",
  userRole: "general",
  technologies: ["React"],
  location: "Boston, MA",
  reputation: 0,
};

const mockQuestions = [
  {
    _id: "65e9b58910afe6e94fc6e6dc",
    title: "How to learn programming?",
    description: "I want to learn programming. Where should I start?",
    asked_by: user1,
    views: 21,
    tags: [tag1], 
    answers: [ans2],
    comments: [comment1],
    vote_count: 0,
    upvoted_by: [user1],
    downvoted_by: [user2],
    flag: false,
  },
  {
    _id: "65e9b5a995b6c7045a30d823",
    title: "Best programming languages for beginners?",
    description: "What are some of the best programming languages for beginners to start with?",
    asked_by: user2,
    views: 99,
    tags: [tag1, tag2],
    answers: [ans1],
    comments: [comment2],
    vote_count: 1,
    upvoted_by: [user1],
    downvoted_by: [],
    flag: false,
  },
];

describe("GET /getQuestion", () => {
  beforeEach(async () => {
    server = require("../server");
      
    // Extract the moderatorCookie from the response heade
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should return questions by filter", async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: "someOrder",
      search: "someSearch",
    };

    getQuestionsByOrder.mockResolvedValueOnce(mockQuestions);
    filterQuestionsBySearch.mockReturnValueOnce(mockQuestions);
    // Making the request
    const response = await supertest(server)
      .get("/question/getQuestion")
      .query(mockReqQuery)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  });

  it("should return status as 500 and empty object in the response", async () => {
    // Mock request query parameters
    const mockReqQuery = {
      order: "someOrder",
      search: "someSearch",
    };

    getQuestionsByOrder.mockImplementation(() => {
      throw new Error("Random!");
    });

    // Making the request
    const response = await supertest(server)
      .get("/question/getQuestion")
      .query(mockReqQuery)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: 'Internal Server Error', details: 'Random!' });
  });
});

describe("GET /getQuestionById/:qid", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should return a question by id and increment its views by 1", async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: "65e9b5a995b6c7045a30d823",
    };

    Question.findOneAndUpdate = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockReturnThis(), 
      exec: jest.fn().mockResolvedValueOnce(mockQuestions[0])
    }));

    showQuesUpDown.mockReturnValueOnce({...mockQuestions[0], upvote: false, downvote: false});

    // Making the request
    const response = await supertest(server).get(
      `/question/getQuestionById/${mockReqParams.qid}`
    )
    .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({...mockQuestions[0], upvote: false, downvote: false});
  });

  it("should return status as 500 and empty object in the response", async () => {
    // Mock request parameters
    const mockReqParams = {
      qid: "65e9b5a995b6c7045a30d823",
    };

    // Provide mock question data
    Question.findOneAndUpdate = jest.fn().mockImplementation(() => {
      throw new Error("Random!");
    });

    // Making the request
    const response = await supertest(server).get(
      `/question/getQuestionById/${mockReqParams.qid}`
    )
    .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Something went wrong', details: 'Random!' });
  });
});

describe("POST /addQuestion", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should add a new question", async () => {
    // Mock request body


    const mockQuestion = {
      _id: "65e9b58910afe6e94fc6e6fe",
      title: "Question 3 Title",
      description: "Question 3 Text",
      tags: [tag1],
    };

    addTag.mockResolvedValue(tag1);
    Question.create.mockResolvedValueOnce(mockQuestion);

    // Making the request
    const response = await supertest(server)
      .post("/question/addQuestion")
      .send(mockQuestion)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion);
    
    expect(Question.create).toHaveBeenCalledWith(
      {
        title: mockQuestion.title,
        description: mockQuestion.description,
        asked_by: moderatorUserId,
        tags: [tag1],
      }
    );
  });

  // it("should fail when tags are more than 5", async () => {
  //   // Mock request body
  //   const mockQuestion = {
  //     "title": "test",
  //     "description": "test description",
  //     "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"]
  //   };

  //   // Making the request
  //   const response = await supertest(server)
  //     .post("/question/addQuestion")
  //     .send(mockQuestion)
  //     .set('Cookie', moderatorCookie);

  //   // Asserting the response
  //   expect(response.status).toBe(400);
  //   expect(response.body).toEqual({ message: "Maximum 5 tags are allowed" });
  // });
});


describe("GET /getReportedQuestions", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should return all reported questions with status 200", async () => {
    const mockReportedQuestions = mockQuestions.map((q) => {
      q.flag = true;
      return q;
    });
  
    Question.find = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValueOnce(mockReportedQuestions),
    }));

    // Making the request
    const response = await supertest(server)
      .get("/question/getReportedQuestions")
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReportedQuestions);
  })

  it("should return status 500 with an error message", async () => {
    Question.find = jest.fn().mockImplementation(() => {
      throw new Error("Random!");
    });

    // Making the request
    const response = await supertest(server)
      .get("/question/getReportedQuestions")
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
  });
});


describe("POST /reportQuestion", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should report a question with a valid question id", async () => {
    const mockReqBody = {
      qid: "65e9b58910afe6e94fc6e6dc",
    };

    Question.exists.mockResolvedValueOnce(true);
    Question.findByIdAndUpdate.mockResolvedValueOnce(mockQuestions[0]);

    // Making the request
    const response = await supertest(server)
      .post("/question/reportQuestion")
      .send(mockReqBody)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Question reported successfully" });
  });

  it("should return status 404 with an error message", async () => {
    const mockReqBody = {
      qid: "65e9b58910afe6e94fc6e6dc",
    };

    Question.exists.mockResolvedValueOnce(false);

    // Making the request
    const response = await supertest(server)
      .post("/question/reportQuestion")
      .send(mockReqBody)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Question not found" });
  });

  it("should return status 500 with an error message", async () => {
    const mockReqBody = {
      qid: "65e9b58910afe6e94fc6e6dc",
    };

    Question.exists.mockImplementation(() => {
      throw new Error("Random!");
    });

    // Making the request
    const response = await supertest(server)
      .post("/question/reportQuestion")
      .send(mockReqBody)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
  });
});

describe("POST /resolveQuestion", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should resolve a question with a valid question id", async () => {
    const mockReqBody = {
      qid: "65e9b58910afe6e94fc6e6dc",
    };

    Question.exists.mockResolvedValueOnce(true);
    Question.findByIdAndUpdate.mockResolvedValueOnce(mockQuestions[0]);

    // Making the request
    const response = await supertest(server)
      .post(`/question/resolveQuestion/${mockReqBody.qid}`)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Question resolved successfully" });
  })

  it("should return status 404 with an error message", async () => {
    const mockReqBody = {
      qid: "65e9b58910afe6e94fc6e6dc",
    };

    Question.exists.mockResolvedValueOnce(false);

    // Making the request
    const response = await supertest(server)
      .post(`/question/resolveQuestion/${mockReqBody.qid}`)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Question not found" });
  })

  it("should return status 500 with an error message", async () => {
    const mockReqBody = {
      qid: "65e9b58910afe6e94fc6e6dc",
    };

    Question.exists.mockImplementation(() => {
      throw new Error("Random!");
    });

    // Making the request
    const response = await supertest(server)
      .post(`/question/resolveQuestion/${mockReqBody.qid}`)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
  });
});


describe("DELETE /deleteQuestion", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should delete a question with an exist id", async () => {
    const mockReqParams = {
      questionId: "65e9b58910afe6e94fc6e6dc",
    };

    Question.exists.mockResolvedValueOnce(true);
    Question.findByIdAndDelete.mockResolvedValueOnce();

    // Making the request
    const response = await supertest(server)
      .delete(`/question/deleteQuestion/${mockReqParams.questionId}`)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Question deleted successfully" });

  });


  it("should return status 404 with an error message", async () => {
    const mockReqParams = {
      questionId: "65e9b58910afe6e94fc6e6dc",
    };

    Question.exists.mockResolvedValueOnce(false);

    // Making the request
    const response = await supertest(server)
      .delete(`/question/deleteQuestion/${mockReqParams.questionId}`)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Question not found" });
  });

  it("should return status 500 with an error message", async () => {
    const mockReqParams = {
      questionId: "65e9b58910afe6e94fc6e6dc",
    };

    Question.exists.mockImplementation(() => {
      throw new Error("Random!");
    });

    // Making the request
    const response = await supertest(server)
      .delete(`/question/deleteQuestion/${mockReqParams.questionId}`)
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
  });
}); 

describe("GET /getTrendingQuestions", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should return trending questions", async () => {
    Question.find = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValueOnce(mockQuestions),
    }));

    getTop10Questions.mockResolvedValueOnce(mockQuestions);
    // Making the request
    const response = await supertest(server)
      .get("/question/getTrendingQuestions")
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  });

  it("should return status 500 with an error message", async () => {
    Question.find = jest.fn().mockImplementation(() => {
      throw new Error("Random!");
    });

    getTop10Questions.mockImplementation(() => {
      throw new Error("Random!");
    });
    // Making the request
    const response = await supertest(server)
      .get("/question/getTrendingQuestions")
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error", details: "Random!" });
  });
});


describe("Test general user authentication", () => {
  beforeEach(async () => {
    server = require("../server");
  });


  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("GET /getReportedQuestions should return status 403", async () => {
    const response = await supertest(server)
      .get("/question/getReportedQuestions")
      .set('Cookie', generalCookie);

    expect(response.status).toBe(403);
  })

  it("POST /resolveQuestion should return status 403", async () => {
    const response = await supertest(server)
      .post("/question/resolveQuestion/65e9b58910afe6e94fc6e6dc")
      .set('Cookie', generalCookie);

    expect(response.status).toBe(403);
  })

  it("DELETE /deleteQuestion should return status 403", async () => {
    const response = await supertest(server)
      .delete("/question/deleteQuestion/65e9b58910afe6e94fc6e6dc")
      .set('Cookie', generalCookie);

    expect(response.status).toBe(403);
  })

});


