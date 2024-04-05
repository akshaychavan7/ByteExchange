import "./index.css";
import QuestionHeader from "./header";
import Question from "./question";

const QuestionPage = ({
  title_text = "All Questions",
  qlist = [],
  getTagById,
  setQuestionOrder,
  handleAnswer,
  handleNewQuestion,
}) => {
  return (
    <>
      <QuestionHeader
        title_text={title_text}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />
      <table className="questions_table">
        <tbody id="question_list" className="question_list">
          {qlist.map((q, idx) => (
            <Question
              q={q}
              key={idx}
              getTagById={getTagById}
              handleAnswer={handleAnswer}
            />
          ))}
        </tbody>
      </table>
      {!qlist.length && (
        <div
          className="bold_title right_padding"
          onClick={() => handleNewQuestion}
        >
          No Questions Found
        </div>
      )}
    </>
  );
};

export default QuestionPage;
