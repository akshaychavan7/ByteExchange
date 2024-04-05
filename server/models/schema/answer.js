const mongoose = require("mongoose");

// Schema for answers
module.exports = mongoose.Schema(
    {
        description: { type: String, required: true },
        ans_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        ans_date_time: { type: Date, required: true, default: Date.now },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
        vote_count: { type: Number, required: true, default: 0 },
        upvoted_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        downvoted_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
        flag: { type: Boolean, required: true, default: false },
    },
    { collection: "Answer" }
);
