import SendIcon from "@mui/icons-material/Send";
import Button from "@mui/material/Button";
export default function AskAQuestionButton({ handleNewQuestion }) {
  return (
    <Button
      variant="contained"
      startIcon={<SendIcon />}
      onClick={handleNewQuestion}
      id="askQuestionButton"
    >
      Ask A Question
    </Button>
  );
}
