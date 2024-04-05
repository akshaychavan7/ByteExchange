import AnswerHeader from "./header";
import "./index.css";

const AnswerPage = (props) => {
  const getAnswerById = (id, answers) => {
    for (let a of answers) {
      if (a.aid == id) {
        return a;
      }
    }

    return null;
  };

  return (
    <>
      <AnswerHeader
        ansCount={props.question.ansIds.length}
        title={props.question.title}
        handleNewQuestion={props.handleNewQuestion}
      />
      <div id="questionBody" className="questionBody right_padding">
        <div className="bold_title answer_question_view">
          {props.question.getQuestionViews()} views
        </div>
        <div className="answer_question_text">
          <div>{props.question.text}</div>
        </div>
        <div className="answer_question_right">
          <div className="question_author">{props.question.askedBy}</div>
          <div className="answer_question_meta">
            {props.question.calculateTimeElapsed()}
          </div>
        </div>
      </div>
      <div>
        {props.question.ansIds.map((answerID) => {
          const answer = getAnswerById(answerID, props.ans);
          return (
            <div className="answer right_padding" key={answer.aid}>
              <div id="answerText" className="answerText">
                <div>{answer.text}</div>
              </div>
              <div className="answerAuthor">
                <div className="answer_author">
                  <div>{answer.ansBy}</div>
                </div>
                <div className="answer_question_meta">
                  {answer.calculateTimeElapsed()}
                </div>
                <div className="answer_question_meta"></div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="bluebtn ansButton" onClick={props.handleNewAnswer}>
        Answer Question
      </button>
    </>
  );
};

export default AnswerPage;
