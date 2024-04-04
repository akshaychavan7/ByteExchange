// User Document Schema
const mongoose = require("mongoose");

const User = require("./schema/question");

module.exports = mongoose.model("Question", User);


