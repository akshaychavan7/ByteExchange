const Answer = require("../models/answers");

const removeDownvote = async (aid, uid) => {
    await Answer.bulkWrite([
        {
            updateOne: {
                "filter": { _id: aid },
                "update": { $pull: { downvoted_by: { $eq: uid } } }
            }
        },
        {
            updateOne: {
                "filter": { _id: aid },
                "update": { $inc: { vote_count: 1 } }
            }
        }
    ])
}

const removeUpvote = async (aid, uid) => {
    await Answer.bulkWrite([
        {
            updateOne: {
                "filter": { _id: aid },
                "update": { $pull: { upvoted_by: { $eq: uid } } }
            }
        },
        {
            updateOne: {
                "filter": { _id: aid },
                "update": { $inc: { vote_count: -1 } }
            }
        }
    ])
}

const addDownvote = async (aid, uid) => {
    await Answer.bulkWrite([
        {
            updateOne: {
                "filter": { _id: aid },
                "update": { $push: { downvoted_by: { $each: [uid], $position: 0 } } }
            }
        },
        {
            updateOne: {
                "filter": { _id: aid },
                "update": { $inc: { vote_count: -1 } }
            }
        }
    ])
}

const addUpvote = async (aid, uid) => {
    await Answer.bulkWrite([
        {
            updateOne: {
                "filter": { _id: aid },
                "update": { $push: { upvoted_by: { $each: [uid], $position: 0 } } }
            }
        },
        {
            updateOne: {
                "filter": { _id: aid },
                "update": { $inc: { vote_count: 1 } }
            }
        }
    ])
}

module.exports = { removeDownvote, removeUpvote, addDownvote, addUpvote };