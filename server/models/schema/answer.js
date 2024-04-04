const mongoose = require("mongoose");

// Schema for answers
module.exports = mongoose.Schema(
    {
        description: { type: String, required: true },
        ans_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        ans_date_time: { type: Date, required: true, default: Date.now },
        votes: { type: Number, required: true, default: 0 },
        comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    },
    { collection: "Answer" }
);
