import "./index.css";
import AskAQuestionButton from "../../AskAQuestionButton/AskAQuestionButton";

const AnswerHeader = ({ ansCount, title, handleNewQuestion }) => {
  return (
    <div id="answersHeader" className="space_between right_padding">
      <div className="bold_title">{ansCount} answers</div>
      <div className="bold_title answer_question_title">{title}</div>
      <AskAQuestionButton handleNewQuestion={handleNewQuestion} />
    </div>
  );
};

export default AnswerHeader;
