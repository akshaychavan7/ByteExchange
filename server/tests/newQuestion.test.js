// unit tests for functions in controller/question.js

const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Question = require("../models/questions");
const {
  addTag,
  getQuestionsByOrder,
  filterQuestionsBySearch,
  showQuesUpDown,
} = require("../utils/question");

jest.mock("../models/questions");
jest.mock("../utils/question", () => ({
  addTag: jest.fn(),
  getQuestionsByOrder: jest.fn(),
  filterQuestionsBySearch: jest.fn(),
  showQuesUpDown: jest.fn()
}));

let server;
let cookie;
let userId;

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
    await mongoose.connect('mongodb://localhost:27017/fake_so', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    server = require("../server");

    const loginResponse = await supertest(server)
      .post("/login/authenticate")
      .send({
        username: "test@gmail.com",
        password: "test"
      });
      
    // Extract the cookie from the response headers
    cookie = loginResponse.headers['set-cookie'];
    userId = loginResponse.body.user.userId;
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
      .set('Cookie', cookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestions);
  });
});

describe("GET /getQuestionById/:qid", () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/fake_so', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    server = require("../server");
  
    const loginResponse = await supertest(server)
      .post("/login/authenticate")
      .send({
        username: "test@gmail.com",
        password: "test"
      });

    cookie = loginResponse.headers['set-cookie'];
    userId = loginResponse.body.user.userId;
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
      exec: jest.fn().mockResolvedValueOnce(mockQuestions[0]), 
    }));

    showQuesUpDown.mockReturnValueOnce(mockQuestions[0]);

    // Making the request
    const response = await supertest(server).get(
      `/question/getQuestionById/${mockReqParams.qid}`
    )
    .set('Cookie', cookie);
    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockPopulatedQuestion);
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
    .set('Cookie', cookie);

    // Asserting the response
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Something went wrong', details: 'Random!' });
  });
});

describe("POST /addQuestion", () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/fake_so', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    server = require("../server");
  
    const loginResponse = await supertest(server)
      .post("/login/authenticate")
      .send({
        username: "test@gmail.com",
        password: "test"
      });

    cookie = loginResponse.headers['set-cookie'];
    userId = loginResponse.body.user.userId;
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
      .set('Cookie', cookie);

    // Asserting the response
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockQuestion);
    
    expect(Question.create).toHaveBeenCalledWith(
      {
        title: mockQuestion.title,
        description: mockQuestion.description,
        asked_by: userId,
        tags: [tag1],
      }
    );
  });
});


describe("GET /getReportedQuestions", () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/fake_so', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    server = require("../server");
  
    const loginResponse = await supertest(server)
      .post("/login/authenticate")
      .send({
        username: "test@gmail.com",
        password: "test"
      });

    cookie = loginResponse.headers['set-cookie'];
    userId = loginResponse.body.user.userId;
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
  
    Question.find.mockResolvedValueOnce(mockReportedQuestions);

    // Making the request
    const response = await supertest(server)
      .get("/question/getReportedQuestions")
      .set('Cookie', cookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReportedQuestions);
  })
});


describe("POST /reportQuestion", () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/fake_so', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    server = require("../server");
  
    const loginResponse = await supertest(server)
      .post("/login/authenticate")
      .send({
        username: "test@gmail.com",
        password: "test"
      });

    cookie = loginResponse.headers['set-cookie'];
    userId = loginResponse.body.user.userId;
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
      .set('Cookie', cookie);

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
      .set('Cookie', cookie);

    // Asserting the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Question not found" });
  });
});

describe("POST /resolveQuestion", () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/fake_so', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    server = require("../server");
  
    const loginResponse = await supertest(server)
      .post("/login/authenticate")
      .send({
        username: "test@gmail.com",
        password: "test"
      });

    cookie = loginResponse.headers['set-cookie'];
    userId = loginResponse.body.user.userId;
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
      .set('Cookie', cookie);

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
      .set('Cookie', cookie);

    // Asserting the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Question not found" });
  })
});


describe("DELETE /deleteQuestion", () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/fake_so', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    server = require("../server");
  
    const loginResponse = await supertest(server)
      .post("/login/authenticate")
      .send({
        username: "test@gmail.com",
        password: "test"
      });

    cookie = loginResponse.headers['set-cookie'];
    userId = loginResponse.body.user.userId;
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
      .set('Cookie', cookie);

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
      .set('Cookie', cookie);

    // Asserting the response
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Question not found" });
  });
}); 



describe("Test general user authentication", () => {
  beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/fake_so', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  
    server = require("../server");
  
    const loginResponse = await supertest(server)
      .post("/login/authenticate")
      .send({
        username: "test2@gmail.com",
        password: "test"
      });

    cookie = loginResponse.headers['set-cookie'];
    userId = loginResponse.body.user.userId;
  });


  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("GET /getReportedQuestions should return status 403", async () => {
    const response = await supertest(server)
      .get("/question/getReportedQuestions")
      .set('Cookie', cookie);

    expect(response.status).toBe(403);
  })

  it("POST /resolveQuestion should return status 403", async () => {
    const response = await supertest(server)
      .post("/question/resolveQuestion/65e9b58910afe6e94fc6e6dc")
      .set('Cookie', cookie);

    expect(response.status).toBe(403);
  })

  it("DELETE /deleteQuestion should return status 403", async () => {
    const response = await supertest(server)
      .delete("/question/deleteQuestion/65e9b58910afe6e94fc6e6dc")
      .set('Cookie', cookie);

    expect(response.status).toBe(403);
  })

});


