const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Question = require("../models/questions");
const Answer = require("../models/answers");
const Comment = require("../models/comments");

jest.mock("../models/questions");
jest.mock("../models/answers");
jest.mock("../models/comments");

let server;
let moderatorCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjQ5MDJiNDVjNGEwNjk3NWM4MmEiLCJ1c2VybmFtZSI6Im1vZGVyYXRvciIsInVzZXJSb2xlIjoibW9kZXJhdG9yIiwiaWF0IjoxNzEzNTY2ODkxLCJleHAiOjE3MTM2NTMyOTF9.dEr4tqgNoZYl02PFv7KGQMoq2PmNEty9r7jCIcp-v48; Expires=Tue, 19 Jan 2038 03:14:07 GMT; Path=/; Secure; HttpOnly"
let moderatorUserId = "6622f4902b45c4a06975c82a"
let generalCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjVkMjhiNTM0ODYxYjhmZTcyNzIiLCJ1c2VybmFtZSI6ImdlbmVyYWwiLCJ1c2VyUm9sZSI6ImdlbmVyYWwiLCJpYXQiOjE3MTM1Njc0NzMsImV4cCI6MTcxMzY1Mzg3M30.0CVom301AncKsC6GdaOuVf_aoppdhksWUcAgBXgNJ9w; Expires=Sat, 20 Apr 2024 23:57:53 GMT; Path=/; Secure; HttpOnly"
let generalUserId = "6622f5d28b534861b8fe7272"


describe("POST /upvote", () => {
    beforeEach(async () => {
        server = require("../server");
    });

    afterEach(async () => {
        server.close();
        await mongoose.disconnect();
    });
    it("should upvote a question if user hasn't upvoted", async () => {
        // Mock the findById method of the Question model
        const mockQuestion = {
          _id: "65e9a5c2b26199dbcc3e6dc8",
          upvoted_by: [],
          downvoted_by: [],
          vote_count: 0
        };
        Question.findById = jest.fn().mockResolvedValue(mockQuestion);
        Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockQuestion, 
            vote_count: mockQuestion.vote_count + 1,
            upvoted_by: [moderatorUserId]
        }); 

        // Making the request to upvote the question
        const response = await supertest(server)
          .post("/vote/upvote")
          .set("Cookie", moderatorCookie)
          .send({ id: mockQuestion._id, type: "question" });
    
        // Check the response
       
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });

        // Check if the upvote was recorded
        expect(Question.findById).toBeCalledWith(mockQuestion._id);
        expect(Question.findByIdAndUpdate).toBeCalledWith(mockQuestion._id, {
            $addToSet: { upvoted_by: moderatorUserId },
            $inc: { vote_count: 1 },
        });
    });

    it("should upvote a question if user has upvoted", async () => {
        // Mock the findById method of the Question model
        const mockQuestion = {
          _id: "65e9a5c2b26199dbcc3e6dc8",
          upvoted_by: [moderatorUserId],
          downvoted_by: [],
          vote_count: 1
        };
        Question.findById = jest.fn().mockResolvedValue(mockQuestion);

        // Making the request to upvote the question
        const response = await supertest(server)
          .post("/vote/upvote")
          .set("Cookie", moderatorCookie)
          .send({ id: mockQuestion._id, type: "question" });
    
        // Check the response
       
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User already upvoted" });

        // Check if the upvote was recorded
        expect(Question.findById).toBeCalledWith(mockQuestion._id);
    });

    it("should upvote a question if user has downvoted", async () => {
        // Mock the findById method of the Question model
        const mockQuestion = {
          _id: "65e9a5c2b26199dbcc3e6dc8",
          upvoted_by: [],
          downvoted_by: [moderatorUserId],
          vote_count: -1
        };
        Question.findById = jest.fn().mockResolvedValue(mockQuestion);
        Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockQuestion, 
            vote_count: mockQuestion.vote_count + 2,
            upvoted_by: [moderatorUserId],
            downvoted_by: []
        }); 

        // Making the request to upvote the question
        const response = await supertest(server)
          .post("/vote/upvote")
          .set("Cookie", moderatorCookie)
          .send({ id: mockQuestion._id, type: "question" });
    
        // Check the response
       
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });

        // Check if the upvote was recorded
        expect(Question.findById).toBeCalledWith(mockQuestion._id);
        expect(Question.findByIdAndUpdate).toBeCalledWith(mockQuestion._id, {
            $pull: { downvoted_by: moderatorUserId },
            $addToSet: { upvoted_by: moderatorUserId },
            $inc: { vote_count: 2 },
        });
    });

    it("should return 404 if question is not found", async () => {
        // Mock the findById method of the Question model
        Question.findById = jest.fn().mockResolvedValue(null);

        // Making the request to upvote the question
        const response = await supertest(server)
          .post("/vote/upvote")
          .set("Cookie", moderatorCookie)
          .send({ id: "65e9a5c2b26199dbcc3e6dc8", type: "question" });
        
        // Check the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ status: 404, message: "Object not found" });
    });

    it("should upvote an answer if user hasn't upvoted", async () => {
        // Mock the findById method of the Answer model
        const mockAnswer = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [],
            downvoted_by: [],
            vote_count: 0
        };
        Answer.findById = jest.fn().mockResolvedValue(mockAnswer);
        Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockAnswer,
            vote_count: mockAnswer.vote_count + 1,
            upvoted_by: [moderatorUserId]
        });

        // Making the request to upvote the answer
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockAnswer._id, type: "answer" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });

        // Check if the upvote was recorded
        expect(Answer.findById).toBeCalledWith(mockAnswer._id);
        expect(Answer.findByIdAndUpdate).toBeCalledWith(mockAnswer._id, {
            $addToSet: { upvoted_by: moderatorUserId },
            $inc: { vote_count: 1 },
        });
    });

    it("should upvote an answer if user has upvoted", async () => {
        // Mock the findById method of the Answer model
        const mockAnswer = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [moderatorUserId],
            downvoted_by: [],
            vote_count: 1
        };
        Answer.findById = jest.fn().mockResolvedValue(mockAnswer);

        // Making the request to upvote the answer
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockAnswer._id, type: "answer" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User already upvoted" });
        
        // Check if the upvote was recorded
        expect(Answer.findById).toBeCalledWith(mockAnswer._id);
    });

    it("should upvote an answer if user has downvoted", async () => {
        // Mock the findById method of the Answer model
        const mockAnswer = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [],
            downvoted_by: [moderatorUserId],
            vote_count: -1
        };
        Answer.findById = jest.fn().mockResolvedValue(mockAnswer);
        Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockAnswer,
            vote_count: mockAnswer.vote_count + 2,
            upvoted_by: [moderatorUserId],
            downvoted_by: []
        });

        // Making the request to upvote the answer
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockAnswer._id, type: "answer" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });
        
        // Check if the upvote was recorded
        expect(Answer.findById).toBeCalledWith(mockAnswer._id);
        expect(Answer.findByIdAndUpdate).toBeCalledWith(mockAnswer._id, {
            $pull: { downvoted_by: moderatorUserId },
            $addToSet: { upvoted_by: moderatorUserId },
            $inc: { vote_count: 2 },
        });
    });

    it("should return 404 if answer is not found", async () => {
        // Mock the findById method of the Answer model
        Answer.findById = jest.fn().mockResolvedValue(null);

        // Making the request to upvote the answer
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", moderatorCookie)
            .send({ id: "65e9a5c2b26199dbcc3e6dc8", type: "answer" });

        // Check the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ status: 404, message: "Object not found" });
    });

    it("should upvote a comment if user hasn't upvoted", async () => {
        // Mock the findById method of the Comment model
        const mockComment = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [],
            downvoted_by: [],
            vote_count: 0
        };
        Comment.findById = jest.fn().mockResolvedValue(mockComment);
        Comment.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockComment,
            vote_count: mockComment.vote_count + 1,
            upvoted_by: [moderatorUserId]
        });

        // Making the request to upvote the comment
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockComment._id, type: "comment" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });

        // Check if the upvote was recorded
        expect(Comment.findById).toBeCalledWith(mockComment._id);
        expect(Comment.findByIdAndUpdate).toBeCalledWith(mockComment._id, {
            $addToSet: { upvoted_by: moderatorUserId },
            $inc: { vote_count: 1 },
        });
    });

    it("should upvote a comment if user has upvoted", async () => {
        // Mock the findById method of the Comment model
        const mockComment = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [moderatorUserId],
            downvoted_by: [],
            vote_count: 1
        };
        Comment.findById = jest.fn().mockResolvedValue(mockComment);
        
        // Making the request to upvote the comment
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockComment._id, type: "comment" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User already upvoted" });

        // Check if the upvote was recorded
        expect(Comment.findById).toBeCalledWith(mockComment._id);
    });

    it("should upvote a comment if user has downvoted", async () => {
        // Mock the findById method of the Comment model
        const mockComment = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [],
            downvoted_by: [moderatorUserId],
            vote_count: -1
        };

        Comment.findById = jest.fn().mockResolvedValue(mockComment);
        Comment.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockComment,
            vote_count: mockComment.vote_count + 2,
            upvoted_by: [moderatorUserId],
            downvoted_by: []
        });

        // Making the request to upvote the comment
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockComment._id, type: "comment" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });

        // Check if the upvote was recorded
        expect(Comment.findById).toBeCalledWith(mockComment._id);
        expect(Comment.findByIdAndUpdate).toBeCalledWith(mockComment._id, {
            $pull: { downvoted_by: moderatorUserId },
            $addToSet: { upvoted_by: moderatorUserId },
            $inc: { vote_count: 2 },
        });
    });

    it("should return 400 if upvote type is invalid", async () => {
        // Making the request to upvote the question
        const response = await supertest(server)
          .post("/vote/upvote")
          .set("Cookie", moderatorCookie)
          .send({ id: "65e9a5c2b26199dbcc3e6dc8", type: "invalid" });
        
        // Check the response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ status: 400, message: "Invalid type" });
    });
});


describe("POST /downvote", () => {
    beforeEach(async () => {
        server = require("../server");
    });

    afterEach(async () => {
        server.close();
        await mongoose.disconnect();
    });
    
    it("should downvote a question if user hasn't downvoted", async () => {
        // Mock the findById method of the Question model
        const mockQuestion = {
          _id: "65e9a5c2b26199dbcc3e6dc8",
          upvoted_by: [],
          downvoted_by: [],
          vote_count: 0
        };
        Question.findById = jest.fn().mockResolvedValue(mockQuestion);
        Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockQuestion, 
            vote_count: mockQuestion.vote_count - 1,
            downvoted_by: [moderatorUserId]
        }); 

        // Making the request to downvote the question
        const response = await supertest(server)
          .post("/vote/downvote")
          .set("Cookie", moderatorCookie)
          .send({ id: mockQuestion._id, type: "question" });
    
        // Check the response
       
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Question.findById).toBeCalledWith(mockQuestion._id);
        expect(Question.findByIdAndUpdate).toBeCalledWith(mockQuestion._id, {
            $addToSet: { downvoted_by: moderatorUserId },
            $inc: { vote_count: -1 },
        });
    });

    it("should downvote a question if user has downvoted", async () => {
        // Mock the findById method of the Question model
        const mockQuestion = {
          _id: "65e9a5c2b26199dbcc3e6dc8",
          upvoted_by: [],
          downvoted_by: [moderatorUserId],
          vote_count: -1
        };
        Question.findById = jest.fn().mockResolvedValue(mockQuestion);

        // Making the request to downvote the question
        const response = await supertest(server)
          .post("/vote/downvote")
          .set("Cookie", moderatorCookie)
          .send({ id: mockQuestion._id, type: "question" });
    
        // Check the response
       
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User already downvoted" });

        // Check if the downvote was recorded
        expect(Question.findById).toBeCalledWith(mockQuestion._id);
    });

    it("should downvote a question if user has upvoted", async () => {
        // Mock the findById method of the Question model
        const mockQuestion = {
          _id: "65e9a5c2b26199dbcc3e6dc8",
          upvoted_by: [moderatorUserId],
          downvoted_by: [],
          vote_count: 1
        };
        Question.findById = jest.fn().mockResolvedValue(mockQuestion);
        Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockQuestion, 
            vote_count: mockQuestion.vote_count - 2,
            upvoted_by: [],
            downvoted_by: [moderatorUserId]
        }); 

        // Making the request to downvote the question
        const response = await supertest(server)
          .post("/vote/downvote")
          .set("Cookie", moderatorCookie)
          .send({ id: mockQuestion._id, type: "question" });
    
        // Check the response
       
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Question.findById).toBeCalledWith(mockQuestion._id);
        expect(Question.findByIdAndUpdate).toBeCalledWith(mockQuestion._id, {
            $pull: { upvoted_by: moderatorUserId },
            $addToSet: { downvoted_by: moderatorUserId },
            $inc: { vote_count: -2 },
        });
    });


    it("should return 404 if question is not found", async () => {
        // Mock the findById method of the Question model
        Question.findById = jest.fn().mockResolvedValue(null);

        // Making the request to downvote the question
        const response = await supertest(server)
          .post("/vote/downvote")
          .set("Cookie", moderatorCookie)
          .send({ id: "65e9a5c2b26199dbcc3e6dc8", type: "question" });

        // Check the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ status: 404, message: "Object not found" });
    })

    it("should downvote an answer if user hasn't downvoted", async () => {
        // Mock the findById method of the Answer model
        const mockAnswer = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [],
            downvoted_by: [],
            vote_count: 0
        };
        Answer.findById = jest.fn().mockResolvedValue(mockAnswer);
        Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockAnswer,
            vote_count: mockAnswer.vote_count - 1,
            downvoted_by: [moderatorUserId]
        });

        // Making the request to downvote the answer
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockAnswer._id, type: "answer" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Answer.findById).toBeCalledWith(mockAnswer._id);
        expect(Answer.findByIdAndUpdate).toBeCalledWith(mockAnswer._id, {
            $addToSet: { downvoted_by: moderatorUserId },
            $inc: { vote_count: -1 },
        });
    });
    
    it("should downvote an answer if user has downvoted", async () => {
        // Mock the findById method of the Answer model
        const mockAnswer = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [],
            downvoted_by: [moderatorUserId],
            vote_count: -1
        };
        Answer.findById = jest.fn().mockResolvedValue(mockAnswer);

        // Making the request to downvote the answer
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockAnswer._id, type: "answer" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User already downvoted" });

        // Check if the downvote was recorded
        expect(Answer.findById).toBeCalledWith(mockAnswer._id);
    });

    it("should downvote an answer if user has upvoted", async () => {
        // Mock the findById method of the Answer model
        const mockAnswer = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [moderatorUserId],
            downvoted_by: [],
            vote_count: 1
        };
        Answer.findById = jest.fn().mockResolvedValue(mockAnswer);
        Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockAnswer,
            vote_count: mockAnswer.vote_count - 2,
            upvoted_by: [],
            downvoted_by: [moderatorUserId]
        });

        // Making the request to downvote the answer
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockAnswer._id, type: "answer" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Answer.findById).toBeCalledWith(mockAnswer._id);
        expect(Answer.findByIdAndUpdate).toBeCalledWith(mockAnswer._id, {
            $pull: { upvoted_by: moderatorUserId },
            $addToSet: { downvoted_by: moderatorUserId },
            $inc: { vote_count: -2 },
        });
    });

    it("should return 404 if answer is not found", async () => {
        // Mock the findById method of the Answer model
        Answer.findById = jest.fn().mockResolvedValue(null);

        // Making the request to downvote the answer
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", moderatorCookie)
            .send({ id: "65e9a5c2b26199dbcc3e6dc8", type: "answer" });

        // Check the response
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ status: 404, message: "Object not found" });
    })

    it("should downvote a comment if user hasn't downvoted", async () => {
        // Mock the findById method of the Comment model
        const mockComment = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [],
            downvoted_by: [],
            vote_count: 0
        };
        Comment.findById = jest.fn().mockResolvedValue(mockComment);
        Comment.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockComment,
            vote_count: mockComment.vote_count - 1,
            downvoted_by: [moderatorUserId]
        });

        // Making the request to downvote the comment
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockComment._id, type: "comment" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Comment.findById).toBeCalledWith(mockComment._id);
        expect(Comment.findByIdAndUpdate).toBeCalledWith(mockComment._id, {
            $addToSet: { downvoted_by: moderatorUserId },
            $inc: { vote_count: -1 },
        });
    });

    it("should downvote a comment if user has downvoted", async () => {
        // Mock the findById method of the Comment model
        const mockComment = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [],
            downvoted_by: [moderatorUserId],
            vote_count: -1
        };
        Comment.findById = jest.fn().mockResolvedValue(mockComment);

        // Making the request to downvote the comment
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockComment._id, type: "comment" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "User already downvoted" });

        // Check if the downvote was recorded
        expect(Comment.findById).toBeCalledWith(mockComment._id);
    });

    it("should downvote a comment if user has upvoted", async () => {
        // Mock the findById method of the Comment model
        const mockComment = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [moderatorUserId],
            downvoted_by: [],
            vote_count: 1
        };
        Comment.findById = jest.fn().mockResolvedValue(mockComment);
        Comment.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockComment,
            vote_count: mockComment.vote_count - 2,
            upvoted_by: [],
            downvoted_by: [moderatorUserId]
        });

        // Making the request to downvote the comment
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", moderatorCookie)
            .send({ id: mockComment._id, type: "comment" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Comment.findById).toBeCalledWith(mockComment._id);
        expect(Comment.findByIdAndUpdate).toBeCalledWith(mockComment._id, {
            $pull: { upvoted_by: moderatorUserId },
            $addToSet: { downvoted_by: moderatorUserId },
            $inc: { vote_count: -2 },
        });
    });
});







