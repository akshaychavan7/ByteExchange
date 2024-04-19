import "./Comments.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import UserResponse from "../Main/UserResponse/UserResponse";
import React from "react";
import { postComment } from "../../services/commentService";
import { useAlert } from "../../context/AlertContext";

export default function Comments({
  commentsList,
  parentId,
  parentType,
  setUpdateState,
}) {
  const alert = useAlert();
  const [description, setDescription] = React.useState("");
  const handlePostComment = async () => {
    let data = {
      description: description,
      parentId: parentId,
      parentType: parentType,
    };
    const response = await postComment(data);
    if (response.status === 200) {
      alert.showAlert("Comment posted successfully", "success");
      setDescription("");
      setUpdateState((prev) => prev + 1);
    } else {
      alert.showAlert("Failed to post comment", "error");
    }
  };

  return (
    <Accordion
      sx={{
        square: true,
        boxShadow: "none",
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon className="expand-more-icon-color" />}
        aria-controls="panel1-content"
        id="panel1-header"
        className="comments-accordion-summary"
      >
        Comments ({commentsList?.length})
      </AccordionSummary>
      <AccordionDetails>
        {commentsList?.map((comment, idx) => {
          return (
            <div
              key={idx}
              style={
                idx === commentsList.length - 1
                  ? {}
                  : { borderBottom: "1px solid #efefef" }
              }
            >
              <UserResponse
                description={comment?.description}
                profilePic={comment?.commented_by?.profilePic}
                author={
                  comment?.commented_by?.firstname +
                  " " +
                  comment?.commented_by?.lastname
                }
                date={comment?.comment_date_time}
                voteCount={comment?.vote_count}
                isUpvoted={comment?.upvote}
                isDownvoted={comment?.downvote}
                postType={"comment"}
                isFlagged={comment?.flag}
                id={comment?._id}
              />
            </div>
          );
        })}
        <div className="add-comment-container">
          <TextField
            id="comment-input"
            label="Add a comment"
            variant="outlined"
            sx={{ width: "80%" }}
            size="small"
            multiline
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handlePostComment}
          >
            Post Comment
          </Button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
