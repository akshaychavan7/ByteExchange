// User Document Schema
const mongoose = require("mongoose");

const Comment = require("./schema/question");

module.exports = mongoose.model("Question", Comment);


