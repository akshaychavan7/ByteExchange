const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const User = require("../models/users");

jest.mock("../models/comments");

let server;
let moderatorCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjQ5MDJiNDVjNGEwNjk3NWM4MmEiLCJ1c2VybmFtZSI6Im1vZGVyYXRvciIsInVzZXJSb2xlIjoibW9kZXJhdG9yIiwiaWF0IjoxNzEzNTY2ODkxLCJleHAiOjE3MTM2NTMyOTF9.dEr4tqgNoZYl02PFv7KGQMoq2PmNEty9r7jCIcp-v48; Expires=Tue, 19 Jan 2038 03:14:07 GMT; Path=/; Secure; HttpOnly"
let moderatorUserId = "6622f4902b45c4a06975c82a"
let generalCookie = "access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NjIyZjVkMjhiNTM0ODYxYjhmZTcyNzIiLCJ1c2VybmFtZSI6ImdlbmVyYWwiLCJ1c2VyUm9sZSI6ImdlbmVyYWwiLCJpYXQiOjE3MTM1Njc0NzMsImV4cCI6MTcxMzY1Mzg3M30.0CVom301AncKsC6GdaOuVf_aoppdhksWUcAgBXgNJ9w; Expires=Sat, 20 Apr 2024 23:57:53 GMT; Path=/; Secure; HttpOnly"
let generalUserId = "6622f5d28b534861b8fe7272"


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

