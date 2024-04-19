const supertest = require("supertest");
const { default: mongoose } = require("mongoose");

const User = require("../models/users");

jest.mock("../models/comments");

let server;
let cookie;
let userId;

describe("POST /getUsersList", () => {
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
        .set("Cookie", cookie)
        .send({ userId: userId });

    // Asserting the response
    expect(response.status).toBe(200);

    // Asserting the response body
    expect(response.body).toEqual(expectedResponse);
    expect(User.find).toHaveBeenCalled();
    });
});

