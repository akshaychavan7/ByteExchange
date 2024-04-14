const Comment = require("../models/comments");


const removeUpvote = async (cid, uid) => {
    await Comment.bulkWrite([
        {
            updateOne: {
                "filter": { _id: cid },
                "update": { $pull: { upvoted_by: { $eq: uid } } }
            }
        },
        {
            updateOne: {
                "filter": { _id: cid },
                "update": { $inc: { vote_count: -1 } }
            }
        }
    ])
}

const addUpvote = async (cid, uid) => {
    await Comment.bulkWrite([
        {
            updateOne: {
                "filter": { _id: cid },
                "update": { $push: { upvoted_by: { $each: [uid], $position: 0 } } }
            }
        },
        {
            updateOne: {
                "filter": { _id: cid },
                "update": { $inc: { vote_count: 1 } }
            }
        }
    ])
}

module.exports = { removeUpvote, addUpvote };