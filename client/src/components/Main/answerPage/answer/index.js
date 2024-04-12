import AuthorMeta from "../../AuthorMeta/AuthorMeta";
import "./index.css";
import { Stack } from "@mui/material";

const Answer = ({ text, ansBy, meta, profilePic }) => {
  return (
    <div className="answer right_padding">
      <div id="answerText" className="answerText">
        {text}
      </div>
      <div className="answerAuthor">
        <Stack direction="column" spacing={1}>
          <AuthorMeta name={ansBy} profilePic={profilePic} />
          <div className="answer_question_meta">{meta}</div>
        </Stack>
      </div>
    </div>
  );
};

export default Answer;
