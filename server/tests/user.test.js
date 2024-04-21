const mockingoose = require("mockingoose");
const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const User = require("../models/users");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const Comment = require("../models/comments");

jest.mock("../models/comments");


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
        Question.find = jest.fn().mockImplementationOnce(() => ({
            populate: jest.fn().mockReturnThis(), 
            exec: jest.fn().mockResolvedValueOnce(mockQuestions)
        }))

        Answer.find = jest.fn().mockImplementationOnce(() => ({
            populate: jest.fn().mockReturnThis(), 
            exec: jest.fn().mockResolvedValueOnce(mockAnswers)
        }))
        Comment.find = jest.fn().mockImplementationOnce(() => ({
            populate: jest.fn().mockReturnThis(), 
            exec: jest.fn().mockResolvedValueOnce(mockComments)
        }))
        
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
