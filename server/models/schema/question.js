const mongoose = require("mongoose");

// Schema for questions
module.exports = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        asked_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        ask_date_time: { type: Date, required: true, default: Date.now },
        views: { type: Number, required: true, default: 0 },
        tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag", validate: [arrayLimit, 'exceeds the limit of 5'] }],
        answers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Answer" }],
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        vote_count: { type: Number, required: true, default: 0 },
        upvoted_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        downvoted_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        flag: { type: Boolean, required: true, default: false },
    },
    { collection: "Question" }
);

function arrayLimit(val) {
    return val.length <= 5;
}