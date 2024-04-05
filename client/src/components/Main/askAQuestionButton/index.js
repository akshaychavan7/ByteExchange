import "./index.css";
const AskAQuestionButton = ({ handleNewQuestion }) => {
  return (
    <button className="bluebtn" onClick={handleNewQuestion}>
      Ask a Question
    </button>
  );
};

export default AskAQuestionButton;
