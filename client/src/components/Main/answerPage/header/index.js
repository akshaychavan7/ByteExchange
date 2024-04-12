import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
import "./index.css";

const AnswerHeader = ({ ansCount, title, handleNewQuestion }) => {
  return (
    <div id="answersHeader" className="space_between right_padding">
      <div className="bold_title">{ansCount} answers</div>
      <div className="bold_title answer_question_title">{title}</div>
      <Button
        variant="contained"
        endIcon={<SendIcon />}
        onClick={handleNewQuestion}
      >
        Ask A Question
      </Button>
    </div>
  );
};

export default AnswerHeader;
