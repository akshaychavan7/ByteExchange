import { useState, useEffect } from "react";
import { getQuestionById } from "../../../services/questionService";
import AnswerHeader from "./header/AnswerHeader";
import "./AnswerPage.css";
import QuestionBody from "./QuestionBody/QuestionBody";
import UserResponse from "../UserResponse/UserResponse";
import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import Comments from "../../Comments/Comments";

const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer, clickTag }) => {
  const [question, setQuestion] = useState({});
  const [updateState, setUpdateState] = useState(0);
  useEffect(() => {
    const fetchData = async () => {
      let res = await getQuestionById(qid);
      setQuestion(res || {});
    };
    fetchData().catch((e) => console.log(e));
  }, [updateState]);
  return (
    <>
      <AnswerHeader
        ansCount={question?.answers?.length}
        views={question?.views}
        title={question?.title}
        handleNewQuestion={handleNewQuestion}
        askDateTime={question?.ask_date_time}
      />
      <QuestionBody
        question={question}
        clickTag={clickTag}
        setUpdateState={setUpdateState}
      />
      <div id="answers-section" className="pl-30 pr-30">
        <h3 className="answers-count">{question?.answers?.length} Answers</h3>

        {question.answers?.map((answer, idx) => {
          return (
            <div key={idx}>
              <UserResponse
                description={answer.description}
                profilePic={answer?.ans_by?.profilePic}
                author={answer.ans_by.firstname + " " + answer.ans_by.lastname}
                date={answer.ans_date_time}
                voteCount={answer.vote_count}
                isUpvoted={answer.upvote}
                isDownvoted={answer.downvote}
                postType={"answer"}
                isFlagged={answer.flag}
                id={answer._id}
              />
              <div id="question-comments">
                <Comments
                  commentsList={answer?.comments}
                  parentId={answer?._id}
                  parentType={"answer"}
                  setUpdateState={setUpdateState}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="answer-question-btn">
        <Button
          variant="contained"
          startIcon={<SendIcon />}
          onClick={handleNewAnswer}
        >
          Answer Question
        </Button>
      </div>
    </>
  );
};

export default AnswerPage;
