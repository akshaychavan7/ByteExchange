const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const User = require("../models/users");

jest.mock("../models/comments");

const { getQuestionsByUser, getAnswersByUser, getCommentsByUser } = require("../utils/user");

jest.mock('../utils/user', () => ({
    getQuestionsByUser: jest.fn(),
    getAnswersByUser: jest.fn(),
    getCommentsByUser: jest.fn()
}));



let server;
let moderatorCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjQ5MDJiNDVjNGEwNjk3NWM4MmEiLCJ1c2VybmFtZSI6Im1vZGVyYXRvciIsInVzZXJSb2xlIjoibW9kZXJhdG9yIiwiaWF0IjoxNzEzNjUzODMyfQ.cp7VPqo7Lp6z7THvvxqA2FBSvl0bGrZF9D5CX7cl2uU; Expires=Wed, 30 May 2300 12:30:00 GMT; Path=/; Secure; HttpOnly"
let moderatorUserId = "6622f4902b45c4a06975c82a"


describe("POST /getUsersList", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });


  it("should return list of users", async () => {
    // Mocking User.find()

    const mockUserList = [
        {
            username: "test1",
            firstname: "firstName1",
            lastname: "lastName1",
            profilePic: "test1",
            location: "test1",
            technologies: "test1"
        },
        {
            username: "test2",
            firstname: "firstName2",
            lastname: "lastName2",
            profilePic: "test2",
            location: "test2",
            technologies: "test2"
        }
    ]

    const expectedResponse = [
        {
            username: "test1",
            name: "firstName1 lastName1",
            profilePic: "test1",
            location: "test1",
            technologies: "test1"
        },
        {
            username: "test2",
            name: "firstName2 lastName2",
            profilePic: "test2",
            location: "test2",
            technologies: "test2"
        }
    ]

    User.find = jest.fn().mockResolvedValueOnce(mockUserList);

    // Making the request
    const response = await supertest(server)
        .post("/user/getUsersList")
        .set("Cookie", moderatorCookie)
        .send({ userId: moderatorUserId });

    // Asserting the response
    expect(response.status).toBe(200);

    // Asserting the response body
    expect(response.body).toEqual(expectedResponse);
    expect(User.find).toHaveBeenCalled();
    });

});


describe("POST /getUserDetails", () => {
    beforeEach(async () => {
        server = require("../server");
    });

    afterEach(async () => {
        server.close();
        await mongoose.disconnect();
    });

    it("should return user details", async () => {
        // Mocking User.findOne()

        const mockUser = {
            _id: "6622f4902b45c4a06975c82a",
            username: "test1",
            firstname: "firstName1",
            lastname: "lastName1",
            joiningDate: "2021-01-01",
            profilePic: "test1",
            userRole: "test1",
            reputation: 0,
            location: "test1",
            technologies: "test1"
        }

        const mockQuestions = [
            {
                _id: "1",
                title: "Question 1",
                description: "Description 1",
                asked_by: "test1",
                tags: ["tag1", "tag2"],
                answers: [],
                comments: [],
                upvoted_by: [],
                downvoted_by: []
            },
            {
                _id: "2",
                title: "Question 2",
                description: "Description 2",
                asked_by: "test1",
                tags: ["tag1", "tag2"],
                answers: [],
                comments: [],
                upvoted_by: [],
                downvoted_by: []
            }
        ]

        const mockAnswers = [
            {
                _id: "1",
                answer: "Answer 1",
                answered_by: "test1",
                question_id: "1",
                upvoted_by: [],
                downvoted_by: []
            },
            {
                _id: "2",
                answer: "Answer 2",
                answered_by: "test1",
                question_id: "2",
                upvoted_by: [],
                downvoted_by: []
            }
        ]

        const mockComments = [
            {
                _id: "1",
                comment: "Comment 1",
                commented_by: "test1",
                question_id: "1"
            },
            {
                _id: "2",
                comment: "Comment 2",
                commented_by: "test1",
                question_id: "2"
            }
        ]

        const expectedResponse = {
            userDetails: {
                username: "test1",
                firstname: "firstName1",
                lastname: "lastName1",
                joiningDate: "2021-01-01",
                profilePic: "test1",
                userRole: "test1",
                reputation: 0,
                location: "test1",
                technologies: "test1",
                questions: mockQuestions,
                answers: mockAnswers,
                comments: mockComments
            }
        }

        User.findOne = jest.fn().mockResolvedValueOnce(mockUser);
        getQuestionsByUser.mockResolvedValueOnce(mockQuestions);
        getAnswersByUser.mockResolvedValueOnce(mockAnswers);
        getCommentsByUser.mockResolvedValueOnce(mockComments);

        
        // Making the request
        const response = await supertest(server)
            .get(`/user/getUserDetails/${mockUser.username}`)
            .set("Cookie", moderatorCookie)
        // Asserting the response

        expect(response.status).toBe(200);
        expect(response.body).toEqual(expectedResponse);

        // Asserting the response body
        expect(User.findOne).toHaveBeenCalled();
    });


    it("should return 500 if error in fetching user details", async () => {
        // Mocking User.findOne
        User.findOne = jest.fn().mockImplementationOnce(() => {
            throw new Error("Error in fetching user details");
        });

        // Making the request
        const response = await supertest(server)
            .get(`/user/getUserDetails/test1`)
            .set("Cookie", moderatorCookie)
        
        // Asserting the response
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Error in fetching user details : Error: Error in fetching user details");
    });
});