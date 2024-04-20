const User = require("../models/users");

const updateReputation = async (upvoteBool, uid) => {
    try {
        let user = await User.findOne({_id: uid});
        if(upvoteBool) {
            user['reputation'] = user['reputation'] + 10;
        }
        else {
            if(user['reputation'] <= 10) {
                user['reputation'] = 0;
            }
            else {
                user['reputation'] = user['reputation'] - 10;
            }
        }
        await user.save();
    }
    catch (err) {
        return new Error(`Error in updating reputation of user: ${err}`);
    }
}


const getQuestionsByUser = async (uid) => {
    try {
      let questions = await Question.find({ asked_by: preprocessing(uid) })
        .populate({ path: "asked_by", select: "username -_id" })
        .populate("tags")
        .populate("answers")
        .populate("comments")
        .populate("upvoted_by")
        .populate("downvoted_by")
        .exec();
  
      return questions;
    } catch (err) {
      return Error(`Error in extracting questions: ${err}`);
    }
  };
  
  const getAnswersByUser = async (uid) => {
    try {
      let answers = await Answer.find({ ans_by: preprocessing(uid) })
        .populate({ path: "ans_by", select: "username -_id" })
        .populate("comments")
        .populate("upvoted_by")
        .populate("downvoted_by")
        .exec();
  
      return answers;
    } catch (err) {
      return Error(`Error in extracting answers: ${err}`);
    }
  };
  
  const getCommentsByUser = async (uid) => {
    try {
      let comments = await Comment.find({ commented_by: preprocessing(uid) })
        .populate({ path: "commented_by", select: "username -_id" })
        .populate("upvoted_by")
        .exec();
  
      return comments;
    } catch (err) {
      return Error(`Error in extracting comments: ${err}`);
    }
  };


module.exports = {updateReputation, getQuestionsByUser, getAnswersByUser, getCommentsByUser};