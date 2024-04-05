import "./index.css";

const Answer = ({ text, ansBy, meta }) => {
  return (
    <div className="answer right_padding">
      <div id="answerText" className="answerText">
        {text}
      </div>
      <div className="answerAuthor">
        <div className="answer_author">{ansBy}</div>
        <div className="answer_question_meta">{meta}</div>
      </div>
    </div>
  );
};

export default Answer;
