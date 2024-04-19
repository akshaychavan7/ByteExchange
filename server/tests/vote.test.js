const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Question = require("../models/questions");
const Answer = require("../models/answers");
const Comment = require("../models/comments");

jest.mock("../models/questions");
jest.mock("../models/answers");
jest.mock("../models/comments");

let server;
let cookie;
let userId;

describe("POST /upvote", () => {
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
            upvoted_by: [userId]
        }); 

        // Making the request to upvote the question
        const response = await supertest(server)
          .post("/vote/upvote")
          .set("Cookie", cookie)
          .send({ id: mockQuestion._id, type: "question" });
    
        // Check the response
       
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });

        // Check if the upvote was recorded
        expect(Question.findById).toBeCalledWith(mockQuestion._id);
        expect(Question.findByIdAndUpdate).toBeCalledWith(mockQuestion._id, {
            $addToSet: { upvoted_by: userId },
            $inc: { vote_count: 1 },
        });
    });

    it("should upvote a question if user has upvoted", async () => {
        // Mock the findById method of the Question model
        const mockQuestion = {
          _id: "65e9a5c2b26199dbcc3e6dc8",
          upvoted_by: [userId],
          downvoted_by: [],
          vote_count: 1
        };
        Question.findById = jest.fn().mockResolvedValue(mockQuestion);

        // Making the request to upvote the question
        const response = await supertest(server)
          .post("/vote/upvote")
          .set("Cookie", cookie)
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
          downvoted_by: [userId],
          vote_count: -1
        };
        Question.findById = jest.fn().mockResolvedValue(mockQuestion);
        Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockQuestion, 
            vote_count: mockQuestion.vote_count + 2,
            upvoted_by: [userId],
            downvoted_by: []
        }); 

        // Making the request to upvote the question
        const response = await supertest(server)
          .post("/vote/upvote")
          .set("Cookie", cookie)
          .send({ id: mockQuestion._id, type: "question" });
    
        // Check the response
       
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });

        // Check if the upvote was recorded
        expect(Question.findById).toBeCalledWith(mockQuestion._id);
        expect(Question.findByIdAndUpdate).toBeCalledWith(mockQuestion._id, {
            $pull: { downvoted_by: userId },
            $addToSet: { upvoted_by: userId },
            $inc: { vote_count: 2 },
        });
    });

    it("should return 404 if question is not found", async () => {
        // Mock the findById method of the Question model
        Question.findById = jest.fn().mockResolvedValue(null);

        // Making the request to upvote the question
        const response = await supertest(server)
          .post("/vote/upvote")
          .set("Cookie", cookie)
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
            upvoted_by: [userId]
        });

        // Making the request to upvote the answer
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", cookie)
            .send({ id: mockAnswer._id, type: "answer" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });

        // Check if the upvote was recorded
        expect(Answer.findById).toBeCalledWith(mockAnswer._id);
        expect(Answer.findByIdAndUpdate).toBeCalledWith(mockAnswer._id, {
            $addToSet: { upvoted_by: userId },
            $inc: { vote_count: 1 },
        });
    });

    it("should upvote an answer if user has upvoted", async () => {
        // Mock the findById method of the Answer model
        const mockAnswer = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [userId],
            downvoted_by: [],
            vote_count: 1
        };
        Answer.findById = jest.fn().mockResolvedValue(mockAnswer);

        // Making the request to upvote the answer
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", cookie)
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
            downvoted_by: [userId],
            vote_count: -1
        };
        Answer.findById = jest.fn().mockResolvedValue(mockAnswer);
        Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockAnswer,
            vote_count: mockAnswer.vote_count + 2,
            upvoted_by: [userId],
            downvoted_by: []
        });

        // Making the request to upvote the answer
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", cookie)
            .send({ id: mockAnswer._id, type: "answer" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });
        
        // Check if the upvote was recorded
        expect(Answer.findById).toBeCalledWith(mockAnswer._id);
        expect(Answer.findByIdAndUpdate).toBeCalledWith(mockAnswer._id, {
            $pull: { downvoted_by: userId },
            $addToSet: { upvoted_by: userId },
            $inc: { vote_count: 2 },
        });
    });

    it("should return 404 if answer is not found", async () => {
        // Mock the findById method of the Answer model
        Answer.findById = jest.fn().mockResolvedValue(null);

        // Making the request to upvote the answer
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", cookie)
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
            upvoted_by: [userId]
        });

        // Making the request to upvote the comment
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", cookie)
            .send({ id: mockComment._id, type: "comment" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });

        // Check if the upvote was recorded
        expect(Comment.findById).toBeCalledWith(mockComment._id);
        expect(Comment.findByIdAndUpdate).toBeCalledWith(mockComment._id, {
            $addToSet: { upvoted_by: userId },
            $inc: { vote_count: 1 },
        });
    });

    it("should upvote a comment if user has upvoted", async () => {
        // Mock the findById method of the Comment model
        const mockComment = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [userId],
            downvoted_by: [],
            vote_count: 1
        };
        Comment.findById = jest.fn().mockResolvedValue(mockComment);
        
        // Making the request to upvote the comment
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", cookie)
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
            downvoted_by: [userId],
            vote_count: -1
        };

        Comment.findById = jest.fn().mockResolvedValue(mockComment);
        Comment.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockComment,
            vote_count: mockComment.vote_count + 2,
            upvoted_by: [userId],
            downvoted_by: []
        });

        // Making the request to upvote the comment
        const response = await supertest(server)
            .post("/vote/upvote")
            .set("Cookie", cookie)
            .send({ id: mockComment._id, type: "comment" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Upvoted successfully" });

        // Check if the upvote was recorded
        expect(Comment.findById).toBeCalledWith(mockComment._id);
        expect(Comment.findByIdAndUpdate).toBeCalledWith(mockComment._id, {
            $pull: { downvoted_by: userId },
            $addToSet: { upvoted_by: userId },
            $inc: { vote_count: 2 },
        });
    });

    it("should return 400 if upvote type is invalid", async () => {
        // Making the request to upvote the question
        const response = await supertest(server)
          .post("/vote/upvote")
          .set("Cookie", cookie)
          .send({ id: "65e9a5c2b26199dbcc3e6dc8", type: "invalid" });
        
        // Check the response
        expect(response.status).toBe(400);
        expect(response.body).toEqual({ status: 400, message: "Invalid type" });
    });
});


describe("POST /downvote", () => {
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
            downvoted_by: [userId]
        }); 

        // Making the request to downvote the question
        const response = await supertest(server)
          .post("/vote/downvote")
          .set("Cookie", cookie)
          .send({ id: mockQuestion._id, type: "question" });
    
        // Check the response
       
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Question.findById).toBeCalledWith(mockQuestion._id);
        expect(Question.findByIdAndUpdate).toBeCalledWith(mockQuestion._id, {
            $addToSet: { downvoted_by: userId },
            $inc: { vote_count: -1 },
        });
    });

    it("should downvote a question if user has downvoted", async () => {
        // Mock the findById method of the Question model
        const mockQuestion = {
          _id: "65e9a5c2b26199dbcc3e6dc8",
          upvoted_by: [],
          downvoted_by: [userId],
          vote_count: -1
        };
        Question.findById = jest.fn().mockResolvedValue(mockQuestion);

        // Making the request to downvote the question
        const response = await supertest(server)
          .post("/vote/downvote")
          .set("Cookie", cookie)
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
          upvoted_by: [userId],
          downvoted_by: [],
          vote_count: 1
        };
        Question.findById = jest.fn().mockResolvedValue(mockQuestion);
        Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockQuestion, 
            vote_count: mockQuestion.vote_count - 2,
            upvoted_by: [],
            downvoted_by: [userId]
        }); 

        // Making the request to downvote the question
        const response = await supertest(server)
          .post("/vote/downvote")
          .set("Cookie", cookie)
          .send({ id: mockQuestion._id, type: "question" });
    
        // Check the response
       
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Question.findById).toBeCalledWith(mockQuestion._id);
        expect(Question.findByIdAndUpdate).toBeCalledWith(mockQuestion._id, {
            $pull: { upvoted_by: userId },
            $addToSet: { downvoted_by: userId },
            $inc: { vote_count: -2 },
        });
    });


    it("should return 404 if question is not found", async () => {
        // Mock the findById method of the Question model
        Question.findById = jest.fn().mockResolvedValue(null);

        // Making the request to downvote the question
        const response = await supertest(server)
          .post("/vote/downvote")
          .set("Cookie", cookie)
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
            downvoted_by: [userId]
        });

        // Making the request to downvote the answer
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", cookie)
            .send({ id: mockAnswer._id, type: "answer" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Answer.findById).toBeCalledWith(mockAnswer._id);
        expect(Answer.findByIdAndUpdate).toBeCalledWith(mockAnswer._id, {
            $addToSet: { downvoted_by: userId },
            $inc: { vote_count: -1 },
        });
    });
    
    it("should downvote an answer if user has downvoted", async () => {
        // Mock the findById method of the Answer model
        const mockAnswer = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [],
            downvoted_by: [userId],
            vote_count: -1
        };
        Answer.findById = jest.fn().mockResolvedValue(mockAnswer);

        // Making the request to downvote the answer
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", cookie)
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
            upvoted_by: [userId],
            downvoted_by: [],
            vote_count: 1
        };
        Answer.findById = jest.fn().mockResolvedValue(mockAnswer);
        Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockAnswer,
            vote_count: mockAnswer.vote_count - 2,
            upvoted_by: [],
            downvoted_by: [userId]
        });

        // Making the request to downvote the answer
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", cookie)
            .send({ id: mockAnswer._id, type: "answer" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Answer.findById).toBeCalledWith(mockAnswer._id);
        expect(Answer.findByIdAndUpdate).toBeCalledWith(mockAnswer._id, {
            $pull: { upvoted_by: userId },
            $addToSet: { downvoted_by: userId },
            $inc: { vote_count: -2 },
        });
    });

    it("should return 404 if answer is not found", async () => {
        // Mock the findById method of the Answer model
        Answer.findById = jest.fn().mockResolvedValue(null);

        // Making the request to downvote the answer
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", cookie)
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
            downvoted_by: [userId]
        });

        // Making the request to downvote the comment
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", cookie)
            .send({ id: mockComment._id, type: "comment" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Comment.findById).toBeCalledWith(mockComment._id);
        expect(Comment.findByIdAndUpdate).toBeCalledWith(mockComment._id, {
            $addToSet: { downvoted_by: userId },
            $inc: { vote_count: -1 },
        });
    });

    it("should downvote a comment if user has downvoted", async () => {
        // Mock the findById method of the Comment model
        const mockComment = {
            _id: "65e9a5c2b26199dbcc3e6dc8",
            upvoted_by: [],
            downvoted_by: [userId],
            vote_count: -1
        };
        Comment.findById = jest.fn().mockResolvedValue(mockComment);

        // Making the request to downvote the comment
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", cookie)
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
            upvoted_by: [userId],
            downvoted_by: [],
            vote_count: 1
        };
        Comment.findById = jest.fn().mockResolvedValue(mockComment);
        Comment.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
            ...mockComment,
            vote_count: mockComment.vote_count - 2,
            upvoted_by: [],
            downvoted_by: [userId]
        });

        // Making the request to downvote the comment
        const response = await supertest(server)
            .post("/vote/downvote")
            .set("Cookie", cookie)
            .send({ id: mockComment._id, type: "comment" });

        // Check the response
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 200, message: "Downvoted successfully" });

        // Check if the downvote was recorded
        expect(Comment.findById).toBeCalledWith(mockComment._id);
        expect(Comment.findByIdAndUpdate).toBeCalledWith(mockComment._id, {
            $pull: { upvoted_by: userId },
            $addToSet: { downvoted_by: userId },
            $inc: { vote_count: -2 },
        });
    });
});







