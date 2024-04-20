const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Comment = require("../models/comments");
const Question = require("../models/questions");
const Answer = require("../models/answers");

jest.mock("../models/comments");

let server;
let moderatorCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjQ5MDJiNDVjNGEwNjk3NWM4MmEiLCJ1c2VybmFtZSI6Im1vZGVyYXRvciIsInVzZXJSb2xlIjoibW9kZXJhdG9yIiwiaWF0IjoxNzEzNTY2ODkxLCJleHAiOjE3MTM2NTMyOTF9.dEr4tqgNoZYl02PFv7KGQMoq2PmNEty9r7jCIcp-v48; Expires=Tue, 19 Jan 2038 03:14:07 GMT; Path=/; Secure; HttpOnly"
let moderatorUserId = "6622f4902b45c4a06975c82a"
let generalCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjVkMjhiNTM0ODYxYjhmZTcyNzIiLCJ1c2VybmFtZSI6ImdlbmVyYWwiLCJ1c2VyUm9sZSI6ImdlbmVyYWwiLCJpYXQiOjE3MTM1Njc0NzMsImV4cCI6MTcxMzY1Mzg3M30.0CVom301AncKsC6GdaOuVf_aoppdhksWUcAgBXgNJ9w; Expires=Sat, 20 Apr 2024 23:57:53 GMT; Path=/; Secure; HttpOnly"
let generalUserId = "6622f5d28b534861b8fe7272"


describe("GET /getReportedComments", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should return all reported comments with status 200", async () => {
    const mockReportedComments = [
      { description: "Reported comment 1" },
      { description: "Reported comment 2" }
    ];

    Comment.find = jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValueOnce(mockReportedComments),
    }));

    // Making the request
    const response = await supertest(server)
      .get("/comment/getReportedComments")
      .set('Cookie', moderatorCookie);

    // Asserting the response
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockReportedComments);
  })
});

describe("POST /addComment", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should add a new comment to a question", async () => {
    const mockReqBody = {
        parentId: "6615559a12306c6dda654821",
        parentType: "question",
        description: "This is a test comment"
    };

    const mockComment = {
      _id: "dummyCommentId",
      description: "This is a test comment"
    }

    Comment.create.mockResolvedValueOnce(mockComment);
    Question.exists = jest.fn().mockResolvedValueOnce(true);
    Question.findByIdAndUpdate = jest.fn().mockResolvedValueOnce();


    const response = await supertest(server)
      .post("/comment/addComment")
      .send(mockReqBody)
      .set('Cookie', moderatorCookie);

    // expect(response.status).toBe(200);
    expect(response.body).toEqual(mockComment);
    expect(Comment.create).toHaveBeenCalledWith({
      description: "This is a test comment",
      commented_by: moderatorUserId
    });
  });

  it("should add a new comment to an answer", async () => {
    const mockReqBody = {
        parentId: "6615559a12306c6dda654821",
        parentType: "answer",
        description: "This is a test comment"
    };

    const mockComment = {
        _id: "dummyCommentId",
        description: "This is a test comment"
    }

    Comment.create.mockResolvedValueOnce(mockComment);
    Answer.exists = jest.fn().mockResolvedValueOnce(true);
    Answer.findByIdAndUpdate = jest.fn().mockResolvedValueOnce();

    const response = await supertest(server)
        .post("/comment/addComment")
        .send(mockReqBody)
        .set('Cookie', moderatorCookie);

    expect(response.body).toEqual(mockComment);
    expect(Comment.create).toHaveBeenCalledWith({
        description: "This is a test comment",
        commented_by: moderatorUserId
    });
    });

  it("should expect 400 with an invalid parent type", async () => {
    const mockReqBody = {
        parentId: "6615559a12306c6dda654821",
        parentType: "invalid",
        description: "This is a test comment"
    };

    const response = await supertest(server)
        .post("/comment/addComment")
        .send(mockReqBody)
        .set('Cookie', moderatorCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid parent" });
    });


  it("should expect 400 with an invalid id format", async () => {
    const mockReqBody = {
      parentId: "dummyParentId",
      parentType: "question",
      description: "This is a test comment"
    };

    Comment.create.mockResolvedValueOnce();

    const response = await supertest(server)
      .post("/comment/addComment")
      .send(mockReqBody)
      .set('Cookie', moderatorCookie);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: "Invalid parent id" });
  })

  it("should expect 404 with a non-existent parent", async () => {
    const mockReqBody = {
      parentId: "6615559a12306c6dda654821",
      parentType: "question",
      description: "This is a test comment"
    };

    Comment.create.mockResolvedValueOnce();
    Question.exists = jest.fn().mockResolvedValueOnce(false);

    const response = await supertest(server)
      .post("/comment/addComment")
      .send(mockReqBody)
      .set('Cookie', moderatorCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Parent not found" });
  });

  it("should expect 500 with an internal server error", async () => {
    const mockReqBody = {
      parentId: "6615559a12306c6dda654821",
      parentType: "question",
      description: "This is a test comment"
    };

    Comment.create.mockRejectedValueOnce();

    const response = await supertest(server)
      .post("/comment/addComment")
      .send(mockReqBody)
      .set('Cookie', moderatorCookie);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ status: 500, message: "Internal Server Error" });
  });
});


describe("POST /reportComment", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should report a comment with a valid comment id", async () => {
    const mockReqBody = {
      cid: "dummyCommentId",
    };

    Comment.exists.mockResolvedValueOnce(true);
    Comment.findByIdAndUpdate.mockResolvedValueOnce();

    const response = await supertest(server)
      .post("/comment/reportComment")
      .send(mockReqBody)
      .set('Cookie', moderatorCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Comment reported successfully" });
  });

  it("should return status 404 with an error message for an invalid comment id", async () => {
    const mockReqBody = {
      cid: "dummyCommentId",
    };

    Comment.exists.mockResolvedValueOnce(false);

    const response = await supertest(server)
      .post("/comment/reportComment")
      .send(mockReqBody)
      .set('Cookie', moderatorCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Comment not found" });
  });

  it("should return status 500 with an error message for an internal server error", async () => {
    const mockReqBody = {
      cid: "dummyCommentId",
    };

    Comment.exists.mockRejectedValueOnce();

    const response = await supertest(server)
      .post("/comment/reportComment")
      .send(mockReqBody)
      .set('Cookie', moderatorCookie);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ status: 500, message: "Internal Server Error" });
  });
});

describe("DELETE /deleteComment/:commentId", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should delete a comment with an exist id", async () => {
    const mockReqParams = {
      commentId: "dummyCommentId",
    };

    Comment.exists.mockResolvedValueOnce(true);
    Comment.findByIdAndDelete.mockResolvedValueOnce();

    const response = await supertest(server)
      .delete(`/comment/deleteComment/${mockReqParams.commentId}`)
      .set('Cookie', moderatorCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Comment deleted successfully" });
  });

  it("should return status 404 with an error message for an invalid comment id", async () => {
    const mockReqParams = {
      commentId: "dummyCommentId",
    };

    Comment.exists.mockResolvedValueOnce(false);

    const response = await supertest(server)
      .delete(`/comment/deleteComment/${mockReqParams.commentId}`)
      .set('Cookie', moderatorCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Comment not found" });
  });

  it("should return status 500 with an error message for an internal server error", async () => {
    const mockReqParams = {
      commentId: "dummyCommentId",
    };

    Comment.exists.mockRejectedValueOnce();

    const response = await supertest(server)
      .delete(`/comment/deleteComment/${mockReqParams.commentId}`)
      .set('Cookie', moderatorCookie);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ message: "Internal Server Error" });
  });
});

describe("POST /resolveComment/:commentId", () => {
  beforeEach(async () => {
    server = require("../server");
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should resolve a comment with a valid comment id", async () => {
    const mockReqParams = {
      commentId: "dummyCommentId",
    };

    Comment.exists.mockResolvedValueOnce(true);
    Comment.findByIdAndUpdate.mockResolvedValueOnce();

    const response = await supertest(server)
      .post(`/comment/resolveComment/${mockReqParams.commentId}`)
      .set('Cookie', moderatorCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Comment resolved successfully" });
  });

  it("should return status 404 with an error message for an invalid comment id", async () => {
    const mockReqParams = {
      commentId: "dummyCommentId",
    };

    Comment.exists.mockResolvedValueOnce(false);

    const response = await supertest(server)
      .post(`/comment/resolveComment/${mockReqParams.commentId}`)
      .set('Cookie', moderatorCookie);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: "Comment not found" });
  });
  
  it("should return status 500 with an error message for an internal server error", async () => {
    const mockReqParams = {
      commentId: "dummyCommentId",
    };

    Comment.exists.mockRejectedValueOnce();

    const response = await supertest(server)
      .post(`/comment/resolveComment/${mockReqParams.commentId}`)
      .set('Cookie', moderatorCookie);

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
    
    it("GET /getReportedComments should return status 403", async () => {
        const response = await supertest(server)
        .get("/comment/getReportedComments")
        .set('Cookie', generalCookie);
    
        expect(response.status).toBe(403);
    });

    it("DELETE /deleteComment should return status 403", async () => {
        const response = await supertest(server)
        .delete("/comment/deleteComment/65e9b58910afe6e94fc6e6dc")
        .set('Cookie', generalCookie);

        expect(response.status).toBe(403);
    });

    it("POST /resolveComment should return status 403", async () => {
        const response = await supertest(server)
        .post("/comment/resolveComment/65e9b58910afe6e94fc6e6dc")
        .set('Cookie', generalCookie);

        expect(response.status).toBe(403);
    });
});