const supertest = require("supertest");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/users");

jest.mock("../models/comments");

let server;

describe("POST /register", () => {
beforeEach(async () => {
    await mongoose.connect('mongodb://localhost:27017/fake_so', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });

    server = require("../server");
});

afterEach(async () => {
    server.close();
    await mongoose.disconnect();
});

it("should register a new user", async () => {
    // Mocking User.findOne()
    User.findOne = jest.fn().mockResolvedValueOnce(null);
    User.create = jest.fn().mockResolvedValueOnce(null);

    // Making the request
    const response = await supertest(server)
    .post("/login/register")
    .send({
        username: "test1",
        password: "test1",
        firstname: "firstName1",
        lastname: "lastName1",
        profilePic: "test1",
        location: "test1",
    });

    // Check the response
    expect(response.body).toEqual({ status: 200, message: "User registered successfully" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User registered successfully");
})

it("should return 400 if user already exists", async () => {
    // Mocking User.findOne()
    User.findOne = jest.fn().mockResolvedValueOnce({});

    // Making the request
    const response = await supertest(server)
    .post("/login/register")
    .send({
        username: "test1",
        password: "test1",
        firstname: "firstName1",
        lastname: "lastName1",
        profilePic: "test1",
        location: "test1",
    });

    // Check the response
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("User already exists");
})
});


describe("POST /authenticate", () => {
    beforeEach(async () => {
        await mongoose.connect('mongodb://localhost:27017/fake_so', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        });
    
        server = require("../server");
    });
    
    afterEach(async () => {
        server.close();
        await mongoose.disconnect();
    });
    
    it("should authenticate a user", async () => {
        // Mocking User.findOne()
        const loginCredentials = {
            username: "test1",
            password: "test1",
        };
          
        User.findOne = jest.fn().mockResolvedValueOnce({
        username: "test1",
        password:  bcrypt.hashSync(loginCredentials.password, 10),
        firstname: "firstName1",
        lastname: "lastName1",
        userRole: "moderator",
        });
    
        // Making the request
        const response = await supertest(server)
        .post("/login/authenticate")
        .send({
            username: "test1",
            password: "test1",
        });
    
        // Check the response
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Logged In Successfully");
    })
    
    it("should return 401 if invalid credentials", async () => {
        // Mocking User.findOne()
        User.findOne = jest.fn().mockResolvedValueOnce(false);
    
        // Making the request
        const response = await supertest(server)
        .post("/login/authenticate")
        .send({
            username: "invalid",
            password: "invalid",
        });
    
        // Check the response
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Invalid username or password");
    })
    });
