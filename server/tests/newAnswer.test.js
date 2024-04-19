// Unit tests for addAnswer in contoller/answer.js

const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Answer = require("../models/answers");
const Question = require("../models/questions");

// Mock the Answer model
jest.mock("../models/answers");

let server;
let cookie;
let userId;

describe("POST /addAnswer", () => {

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

  it("should add a new answer to the question", async () => {
    // Mocking the request body
    const mockReqBody = {
      qid: "dummyQuestionId",
      ans: {
        description: "This is a test answer"
      }
    };

    const mockAnswer = {
      _id: "dummyAnswerId",
      description: "This is a test answer"
    }
    // Mock the create method of the Answer model
    Answer.create.mockResolvedValueOnce(mockAnswer);

    // Mocking the Question.findOneAndUpdate method
    Question.findOneAndUpdate = jest.fn().mockResolvedValueOnce({
      _id: "dummyQuestionId",
      answers: ["dummyAnswerId"]
    });

    // Making the request
    const response = await supertest(server)
      .post("/answer/addAnswer")
      .send(mockReqBody)
      .set('Cookie', [cookie]);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer);

    // Verifying that Answer.create method was called with the correct arguments
    expect(Answer.create).toHaveBeenCalledWith({
      description: "This is a test answer",
      ans_by: userId
    });

    // Verifying that Question.findOneAndUpdate method was called with the correct arguments
    expect(Question.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: "dummyQuestionId" },
      { $push: { answers: { $each: ["dummyAnswerId"], $position: 0 } } },
      { new: true }
    );
  });

  describe("POST /reportAnswer", () => {
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

    it("should report an answer with a valid answer id", async () => {
      const mockReqBody = {
        aid: "dummyAnswerId",
      };
  
      Answer.exists.mockResolvedValueOnce(true);
      Answer.findByIdAndUpdate.mockResolvedValueOnce();
  
      // Making the request
      const response = await supertest(server)
        .post("/answer/reportAnswer")
        .send(mockReqBody)
        .set('Cookie', cookie);
  
      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Answer reported" });
    })

    it("should return status 404 with an error message", async () => {
      const mockReqBody = {
        aid: "dummyAnswerId",
      };
  
      Answer.exists.mockResolvedValueOnce(false);
  
      // Making the request
      const response = await supertest(server)
        .post("/answer/reportAnswer")
        .send(mockReqBody)
        .set('Cookie', cookie);
  
      // Asserting the response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Answer not found" });
    })
  });


  describe("GET /getReportedAnswers", () => {
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

    it("should return all reported answers with status 200", async () => {
      const mockReportedAnswers = [
        { description: "This is a test answer", flag: true },
        { description: "This is another test answer", flag: true }
      ];

      Answer.find.mockResolvedValueOnce(mockReportedAnswers);

      // Making the request
      const response = await supertest(server)
        .get("/answer/getReportedAnswers")
        .set('Cookie', cookie);
      
      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReportedAnswers);
    })
  });

  describe("DELETE /deleteAnswer", () => {
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

    it("should delete an answer with an exist id", async () => {
      const mockReqParams = {
        answerId: "dummyAnswerId",
      };
      
      Answer.exists.mockResolvedValueOnce(true);
      Answer.findByIdAndDelete.mockResolvedValueOnce();
      
      // Making the request
      const response = await supertest(server)
        .delete(`/answer/deleteAnswer/${mockReqParams.answerId}`)
        .set('Cookie', cookie);
      
      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Answer deleted successfully" });
    });
    
    it("should return status 404 with an error message", async () => {
      const mockReqParams = {
        answerId: "dummyAnswerId",
      };
      
      Answer.exists.mockResolvedValueOnce(false);
      
      // Making the request
      const response = await supertest(server)
        .delete(`/answer/deleteAnswer/${mockReqParams.answerId}`)
        .set('Cookie', cookie);
      
      // Asserting the response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Answer not found" });
    })
  });

  describe("POST /resolveAnswer", () => {
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

    it("should resolve an answer with a valid answer id", async () => {
      const mockReqParams = {
        answerId: "dummyAnswerId",
      };

      Answer.exists.mockResolvedValueOnce(true);
      Answer.findByIdAndUpdate.mockResolvedValueOnce();

      // Making the request
      const response = await supertest(server)
        .post(`/answer/resolveAnswer/${mockReqParams.answerId}`)
        .set('Cookie', cookie);
      
      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: "Answer resolved successfully" });
    });

    it("should return status 404 with an error message", async () => {
      const mockReqParams = {
        answerId: "dummyAnswerId",
      };

      Answer.exists.mockResolvedValueOnce(false);

      // Making the request
      const response = await supertest(server)
        .post(`/answer/resolveAnswer/${mockReqParams.answerId}`)
        .set('Cookie', cookie);
      
      // Asserting the response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Answer not found" });
    })
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

    it("GET /getReportedAnswers should return status 403", async () => {
      const response = await supertest(server)
        .get("/answer/getReportedAnswers")
        .set('Cookie', cookie);

      expect(response.status).toBe(403);
    });

    it("POST /reportAnswer should return status 403", async () => {
      const response = await supertest(server)
        .post("/answer/reportAnswer")
        .set('Cookie', cookie);

      expect(response.status).toBe(403);
    });


    it("DELETE /deleteAnswer should return status 403", async () => {
      const response = await supertest(server)
        .delete("/answer/deleteAnswer/65e9b58910afe6e94fc6e6dc")
        .set('Cookie', cookie);

      expect(response.status).toBe(403);
    })
  });

  
});
