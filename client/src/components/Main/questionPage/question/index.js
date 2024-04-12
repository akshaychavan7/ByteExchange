import { getMetaData } from "../../../../tool";
import AuthorMeta from "../../AuthorMeta/AuthorMeta";
import "./index.css";
import { Stack } from "@mui/material";

const Question = ({ q, clickTag, handleAnswer }) => {
  return (
    <div
      className="question right_padding"
      onClick={() => {
        handleAnswer(q._id);
      }}
    >
      <div className="postStats">
        <div>{q.vote_count || 0} votes</div>
        <div>{q.answers.length || 0} answers</div>
        <div>{q.views} views</div>
      </div>
      <div className="question_mid">
        <div className="postTitle">{q.title}</div>
        <div className="question_tags">
          {q.tags.map((tag, idx) => {
            return (
              <button
                key={idx}
                className="question_tag_button"
                onClick={(e) => {
                  e.stopPropagation();
                  clickTag(tag.name);
                }}
              >
                {tag.name}
              </button>
            );
          })}
        </div>
      </div>
      <div className="lastActivity">
        <Stack direction="column" spacing={1}>
          <AuthorMeta
            name={q.asked_by.firstname + " " + q.asked_by.lastname}
            profilePic={q.asked_by.profilePic}
          />
          <div className="question_meta">
            asked {getMetaData(new Date(q.ask_date_time))}
          </div>
        </Stack>
      </div>
    </div>
  );
};

export default Question;
