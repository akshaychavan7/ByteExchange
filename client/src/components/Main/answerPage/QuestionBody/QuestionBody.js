import "./QuestionBody.css";
import React from "react";
import TagChip from "../../TagChip/TagChip";
import UserResponse from "../../UserResponse/UserResponse";
import Comments from "../../../Comments/Comments";

const QuestionBody = ({ question, clickTag }) => {
  return (
    <div className="pl-30 pr-30">
      <UserResponse
        className="right_padding pt-0"
        description={question?.description}
        profilePic={question?.asked_by?.profilePic}
        author={
          question?.asked_by?.firstname + " " + question?.asked_by?.lastname
        }
        date={question?.ask_date_time}
        voteCount={question?.vote_count}
        isUpvoted={question?.upvote}
        isDownvoted={question?.downvote}
      />
      <div id="question-tags">
        {question?.tags?.map((tag, idx) => {
          return <TagChip key={idx} tag={tag} clickTag={clickTag} />;
        })}
      </div>
      <div id="question-comments" className="mt-30">
        <Comments commentsList={question?.comments} />
      </div>
    </div>
  );
};

export default QuestionBody;
