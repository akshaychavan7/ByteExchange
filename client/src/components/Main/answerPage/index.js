import { useState, useEffect } from "react";
import { getQuestionById } from "../../../services/questionService";
import { getMetaData } from "../../../tool";
import AnswerHeader from "./header";
import Answer from "./answer";
import "./index.css";
import { Stack } from "@mui/material";
import AuthorMeta from "../AuthorMeta/AuthorMeta";

const AnswerPage = ({ qid, handleNewQuestion, handleNewAnswer }) => {
  const [question, setQuestion] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      let res = await getQuestionById(qid);
      setQuestion(res || {});
    };
    fetchData().catch((e) => console.log(e));
  }, []);
  return (
    <>
      <AnswerHeader
        ansCount={question.answers?.length}
        title={question.title}
        handleNewQuestion={handleNewQuestion}
      />
      <div id="questionBody" className="questionBody right_padding">
        <div className="bold_title answer_question_view">
          {question.views} views
        </div>
        <div className="answer_question_text">
          <div>{question.description}</div>
        </div>
        <div className="answer_question_right">
          <Stack direction="column" spacing={1}>
            <AuthorMeta
              name={
                question.asked_by?.firstname + " " + question.asked_by?.lastname
              }
              profilePic={question?.asked_by?.profilePic}
            />
            <div className="answer_question_meta">
              {getMetaData(new Date(question.ask_date_time))}
            </div>
          </Stack>
        </div>
      </div>
      <div>
        {question.answers?.map((answer) => {
          return (
            <Answer
              key={answer._id}
              text={answer.description}
              ansBy={answer.ans_by.firstname + " " + answer.ans_by.lastname}
              meta={getMetaData(new Date(answer.ans_date_time))}
              profilePic={answer?.ans_by?.profilePic}
            />
          );
        })}
      </div>
      <button className="bluebtn ansButton" onClick={handleNewAnswer}>
        Answer Question
      </button>
    </>
  );
};

export default AnswerPage;
