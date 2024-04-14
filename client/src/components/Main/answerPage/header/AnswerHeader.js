import "./AnswerHeader.css";
import AskAQuestionButton from "../../AskAQuestionButton/AskAQuestionButton";
import { getDurationPassed } from "../../../../util/utils";
import { Typography } from "@mui/material";

const AnswerHeader = ({
  ansCount,
  views,
  title,
  handleNewQuestion,
  askDateTime,
}) => {
  return (
    <div className="header-container">
      <div
        id="answersHeader"
        className="question-head right_padding bottom-padding-1"
      >
        <Typography variant="h4" className="answer_question_title">
          {" "}
          {title}{" "}
        </Typography>

        <AskAQuestionButton handleNewQuestion={handleNewQuestion} />
      </div>
      <div className="question-meta">
        <span>
          <span className="darkgray">Asked</span>{" "}
          {getDurationPassed(askDateTime)}
        </span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span>
          <span className="darkgray">Viewed</span> {views} times
        </span>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <span>
          <span className="darkgray">Answers</span> {ansCount}
        </span>
      </div>
    </div>
  );
};

export default AnswerHeader;
