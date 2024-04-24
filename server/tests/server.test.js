const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const Comment = require("../models/comments");
const Question = require("../models/questions");
const Answer = require("../models/answers");

jest.mock("../models/comments");

let server;
let moderatorCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjQ5MDJiNDVjNGEwNjk3NWM4MmEiLCJ1c2VybmFtZSI6Im1vZGVyYXRvciIsInVzZXJSb2xlIjoibW9kZXJhdG9yIiwiaWF0IjoxNzEzNjUzODMyfQ.cp7VPqo7Lp6z7THvvxqA2FBSvl0bGrZF9D5CX7cl2uU; Expires=Wed, 30 May 2300 12:30:00 GMT; Path=/; Secure; HttpOnly"


describe("Is User Authenticated", () => {
  beforeAll(() => {
    server = require("../server");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  it("should return 200 if user is authenticated", async () => {
    const response = await supertest(server)
      .get("/isUserAuthenticated")
      .set("Cookie", moderatorCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User is authenticated" });
  });

  it("should return 403 if user is not authenticated", async () => {
    const response = await supertest(server).get("/isUserAuthenticated");

    expect(response.status).toBe(403);
  });
});


describe("Is Moderator Authenticated", () => {
  beforeAll(() => {
    server = require("../server");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  it("should return 200 if moderator is authenticated", async () => {
    const response = await supertest(server)
      .get("/isUserModeratorAuthenticated")
      .set("Cookie", moderatorCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User is authenticated" });
  });

  it("should return 403 if user is not authenticated", async () => {
    const response = await supertest(server).get("/isUserModeratorAuthenticated");

    expect(response.status).toBe(403);
  });
});



describe("Logout", () => {
  beforeAll(() => {
    server = require("../server");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  it("should return 200 if user is logged out", async () => {
    const response = await supertest(server)
      .get("/logout")
      .set("Cookie", moderatorCookie);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 200, message: "Successfully logged out" });
  });

  it("should return 403 if user is not authenticated", async () => {
    const response = await supertest(server).get("/logout");

    expect(response.status).toBe(403);
  });
});


describe("Check authroization middleware", () => {
  beforeAll(() => {
    server = require("../server");
  });

  afterAll(async () => {
    await server.close();
    await mongoose.disconnect();
  });

  it("general should return 403 if token is valid", async () => {
    const response = await supertest(server).get("/isUserAuthenticated")
      .set("Cookie", "access_token=invalid");

    expect(response.status).toBe(403);
  });

  it("moderator should return 403 if token is valid", async () => {
    const response = await supertest(server).get("/isUserModeratorAuthenticated")
      .set("Cookie", "access_token=invalid");

    expect(response.status).toBe(403);
  });
});
