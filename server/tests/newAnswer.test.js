// Unit tests for addAnswer in contoller/answer.js

const supertest = require("supertest")
const { default: mongoose } = require("mongoose");

const Answer = require("../models/answers");
const Question = require("../models/questions");

// Mock the Answer model
jest.mock("../models/answers");

let server;
let moderatorCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjQ5MDJiNDVjNGEwNjk3NWM4MmEiLCJ1c2VybmFtZSI6Im1vZGVyYXRvciIsInVzZXJSb2xlIjoibW9kZXJhdG9yIiwiaWF0IjoxNzEzNjUzODMyfQ.cp7VPqo7Lp6z7THvvxqA2FBSvl0bGrZF9D5CX7cl2uU; Expires=Wed, 30 May 2300 12:30:00 GMT; Path=/; Secure; HttpOnly"
let moderatorUserId = "6622f4902b45c4a06975c82a"
let generalCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjVkMjhiNTM0ODYxYjhmZTcyNzIiLCJ1c2VybmFtZSI6ImdlbmVyYWwiLCJ1c2VyUm9sZSI6ImdlbmVyYWwiLCJpYXQiOjE3MTM2NTQwMTcsImV4cCI6MTcxMzc0MDQxN30.XBKevPMMmyLX_u3o_xMoPRTkG9OH6702EIcf6Th-CR8; Expires=Mon, 17 Dec 2300 08:24:00 GMT; Path=/; Secure; HttpOnly"
let generalUserId = "6622f5d28b534861b8fe7272"

describe("POST /addAnswer", () => {

  beforeEach(async () => {
    server = require("../server");
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
      .set('Cookie', [moderatorCookie]);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockAnswer);

    // Verifying that Answer.create method was called with the correct arguments
    expect(Answer.create).toHaveBeenCalledWith({
      description: "This is a test answer",
      ans_by: moderatorUserId
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
      server = require("../server");
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
        .set('Cookie', moderatorCookie);
  
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
        .set('Cookie', moderatorCookie);
  
      // Asserting the response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Answer not found" });
    })

    it("should return status 500 with an error message", async () => {
      const mockReqBody = {
        aid: "dummyAnswerId",
      };
  
      Answer.exists.mockRejectedValueOnce(new Error("Database error"));
  
      // Making the request
      const response = await supertest(server)
        .post("/answer/reportAnswer")
        .send(mockReqBody)
        .set('Cookie', moderatorCookie);
  
      // Asserting the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
    })
  });


  describe("GET /getReportedAnswers", () => {
    beforeEach(async () => {
      server = require("../server");
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

      Answer.find = jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValueOnce(mockReportedAnswers),
      }));

      // Making the request
      const response = await supertest(server)
        .get("/answer/getReportedAnswers")
        .set('Cookie', moderatorCookie);
      
      // Asserting the response
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockReportedAnswers);
    })

    it("should return status 500 with an error message", async () => {
      Answer.find = jest.fn().mockImplementation(() => {
        throw new Error("Database error");
      });

      // Making the request
      const response = await supertest(server)
        .get("/answer/getReportedAnswers")
        .set('Cookie', moderatorCookie);
      
      // Asserting the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
    });
  });

  describe("DELETE /deleteAnswer", () => {
    beforeEach(async () => {

    
      server = require("../server");
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
        .set('Cookie', moderatorCookie);
      
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
        .set('Cookie', moderatorCookie);
      
      // Asserting the response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Answer not found" });
    })

    it("should return status 500 with an error message", async () => {
      const mockReqParams = {
        answerId: "dummyAnswerId",
      };
      
      Answer.exists.mockRejectedValueOnce(new Error("Database error"));
      
      // Making the request
      const response = await supertest(server)
        .delete(`/answer/deleteAnswer/${mockReqParams.answerId}`)
        .set('Cookie', moderatorCookie);
      
      // Asserting the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
    });
  });

  describe("POST /resolveAnswer", () => {
    beforeEach(async () => {
      server = require("../server");
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
        .set('Cookie', moderatorCookie);
      
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
        .set('Cookie', moderatorCookie);
      
      // Asserting the response
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: "Answer not found" });
    })

    it("should return status 500 with an error message", async () => {
      const mockReqParams = {
        answerId: "dummyAnswerId",
      };

      Answer.exists.mockRejectedValueOnce(new Error("Database error"));

      // Making the request
      const response = await supertest(server)
        .post(`/answer/resolveAnswer/${mockReqParams.answerId}`)
        .set('Cookie', moderatorCookie);
      
      // Asserting the response
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ message: "Internal Server Error" });
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

    it("GET /getReportedAnswers should return status 403", async () => {
      const response = await supertest(server)
        .get("/answer/getReportedAnswers")
        .set('Cookie', generalCookie);

      expect(response.status).toBe(403);
    });


    it("DELETE /deleteAnswer should return status 403", async () => {
      const response = await supertest(server)
        .delete("/answer/deleteAnswer/65e9b58910afe6e94fc6e6dc")
        .set('Cookie', generalCookie);

      expect(response.status).toBe(403);
    })
  });

  
});
