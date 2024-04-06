// Application server

const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const cors = require("cors");

const { MONGO_URL, port, CLIENT_URL, SECRET_KEY } = require("./config");

mongoose.connect(MONGO_URL);

const app = express();

app.use(cookieParser());

app.use(
  cors({
    credentials: true,
    origin: [CLIENT_URL],
  })
);

app.use(bodyParser.json({ limit: "50mb", type: "application/json" }));

app.use(express.json());

// Middleware to authorize JWT token - ref: https://dev.to/franciscomendes10866/using-cookies-with-jwt-in-node-js-8fn
const authorization = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    return res.sendStatus(403);
  }
  try {
    const data = jwt.verify(token, SECRET_KEY);
    req.userId = data.id;
    req.userRole = data.role;
    return next();
  } catch {
    return res.sendStatus(403);
  }
};

app.get("/", (_, res) => {
  res.send("Fake SO Server Dummy Endpoint");
  res.end();
});

const questionController = require("./controller/question");
const tagController = require("./controller/tag");
const answerController = require("./controller/answer");
const loginController = require("./controller/login");

app.use("/question", questionController);
app.use("/tag", tagController);
app.use("/answer", answerController);
app.use("/login", loginController);
app.use("/register", loginController);
let server = app.listen(port, () => {
  console.log(`Server starts at http://localhost:${port}`);
});

// route to check if user is authenticated
app.get("/isUserAuthenticated", authorization, (req, res) => {
  res.json({ message: "User is authenticated" });
});

// Logout route
app.get("/logout", authorization, (req, res) => {
  return res
    .clearCookie("access_token")
    .status(200)
    .json({ message: "Successfully logged out" });
});

process.on("SIGINT", () => {
  server.close();
  mongoose.disconnect();
  console.log("Server closed. Database instance disconnected");
  process.exit(0);
});

module.exports = { server, authorization };
