const express = require("express");
const Comment = require("../models/comments");
const Question = require("../models/questions");
const Answer = require("../models/answers");
const router = express.Router();
const authorization = require("../middleware/authorization");
const { validateId } = require("../utils/validator");

const addComment = async (req, res) => {
    try {
        let comment = await Comment.create({
            description: req.body.description,
            commented_by: req.userId,
            comment_date_time: new Date(),
        });


        let parentId = req.body.parentId;
        let parentType = req.body.parentType; 

        if (!validateId(parentId)) {
            return res.status(400).send('Invalid parent id');
        }

        let parentModel;
        if (parentType === 'question') {
            parentModel = Question;
        } else if (parentType === 'answer') {
            parentModel = Answer;
        } else {
            return res.status(400).send('Invalid parent type');
        }

        let parentObject = await parentModel.exists({ _id: parentId });
        if (!parentObject) {
            return res.status(404).send('Parent object not found');
        }

        await parentModel.findByIdAndUpdate(parentId, { $push: { comments: comment._id } }, { new: true });
        
        res.status(200).json(comment);

    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Internal Server Error");
    }
}

router.post("/addComment", authorization, addComment);

module.exports = router;