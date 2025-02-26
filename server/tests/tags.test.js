// Unit tests for getTagsWithQuestionNumber in controller/tags.js

const supertest = require("supertest");

const Tag = require("../models/tags");
const Question = require("../models/questions");
const { default: mongoose } = require("mongoose");

// Mock data for tags
const mockTags = [
  { name: "tag1" },
  { name: "tag2" },
  // Add more mock tags if needed
];

const mockQuestions = [
  { tags: [mockTags[0], mockTags[1]] },
  { tags: [mockTags[0]] },
];

let server;
let moderatorCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjQ5MDJiNDVjNGEwNjk3NWM4MmEiLCJ1c2VybmFtZSI6Im1vZGVyYXRvciIsInVzZXJSb2xlIjoibW9kZXJhdG9yIiwiaWF0IjoxNzEzNjUzODMyfQ.cp7VPqo7Lp6z7THvvxqA2FBSvl0bGrZF9D5CX7cl2uU; Expires=Wed, 30 May 2300 12:30:00 GMT; Path=/; Secure; HttpOnly"

describe("GET /getTagsWithQuestionNumber", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should return tags with question numbers", async () => {
    // Mocking Tag.find() and Question.find()
    Tag.find = jest.fn().mockResolvedValueOnce(mockTags);

    Question.find = jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockResolvedValueOnce(mockQuestions),
    }));

    // Making the request
    const response = await supertest(server).get(
      "/tag/getTagsWithQuestionNumber"
    )
    .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(200);

    // Asserting the response body
    expect(response.body).toEqual([
      { name: "tag1", qcnt: 2 },
      { name: "tag2", qcnt: 1 },
    ]);
    expect(Tag.find).toHaveBeenCalled();
    expect(Question.find).toHaveBeenCalled();
  });
});
