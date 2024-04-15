import { Stack } from "@mui/material";
import { getMetaData } from "../../../tool";
import AuthorMeta from "../AuthorMeta/AuthorMeta";
import UpvoteDownvote from "../UpvoteDownvote/UpvoteDownvote";
import "./UserResponse.css";

// UserResponse represents either a comment, a question body, or an answer body
export default function UserResponse({
  description,
  author,
  profilePic,
  date,
  voteCount,
  isUpvoted,
  isDownvoted,
  isFlagged,
  postType,
  id,
}) {
  return (
    <div className="user-response-body right_padding pt-0 pb-0">
      <div style={{ marginTop: "-8px" }}>
        <UpvoteDownvote
          voteCount={voteCount}
          isUpvoted={isUpvoted}
          isDownvoted={isDownvoted}
          isFlagged={isFlagged}
          postType={postType}
          id={id}
        />
      </div>
      <div className="response-description">
        <div>{description}</div>
      </div>
      <div className="user-response-meta">
        <Stack direction="column" spacing={1}>
          <AuthorMeta name={author} profilePic={profilePic} />
          <div className="answer_question_meta">
            {getMetaData(new Date(date))}
          </div>
        </Stack>
      </div>
    </div>
  );
}
