const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        username: { type: String, required: true },
        password: { type: String, required: true },
        joiningDate: { type: Date, required: true, default: Date.now },
        profilePic: { type: String, required: false },
        userRole: { type: String, enum: ["moderator", "general"], required: true, default: "general" },
    },
    { collection: "User" }
);
