const mongoose = require("mongoose");

module.exports = mongoose.Schema(
    {
        description: { type: String, required: true },
        commented_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment_date_time: { type: Date, required: true, default: Date.now },
        votes: { type: Number, required: true, default: 0 },
    },
    { collection: "Comment" }
);
