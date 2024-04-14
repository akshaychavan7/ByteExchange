import React, { useEffect, useState } from "react";
import { IconButton, Typography, Tooltip } from "@mui/material";
import {
  DownloadRounded,
  UploadRounded,
  FlagRounded,
} from "@mui/icons-material";
import "./UpvoteDownvote.css";
import { useAlert } from "../../../context/AlertContext";

// TODO: handle upvote and downvote functionality
const UpvoteDownvote = ({ voteCount, isUpvoted, isDownvoted, isFlagged }) => {
  const alert = useAlert();
  const [votes, setVotes] = useState(voteCount || 0);
  const [voted, setVoted] = useState(null);
  const [flagged, setFlagged] = useState(isFlagged);

  useEffect(() => {
    setVoted(isUpvoted ? "up" : isDownvoted ? "down" : null);
  }, [isUpvoted, isDownvoted]);

  useEffect(() => {
    setVotes(voteCount);
  }, [voteCount]);

  useEffect(() => {
    setFlagged(isFlagged);
  }, [isFlagged]);

  const handleVote = (type) => {
    if (voted === type) {
      // If already voted
      alert.showAlert("You have already voted", "error");
    } else {
      // Upvote or downvote accordingly
      if (type === "up") {
        setVotes(votes + 1);
      } else {
        setVotes(votes - 1);
      }
      setVoted(type);
    }
  };

  const handleFlag = () => {
    if (flagged) {
      alert.showAlert("This post/comment has already been flagged", "error");
      return;
    } else {
      setFlagged(true);
      alert.showAlert("Post has been flagged for review", "info");
    }
  };

  return (
    <div>
      <div>
        <Tooltip title="Upvote" placement="top">
          <IconButton
            onClick={() => handleVote("up")}
            color={voted === "up" ? "primary" : "default"}
            size="small"
          >
            <UploadRounded />
          </IconButton>
        </Tooltip>
        <Typography
          variant="body1"
          className="vote-count"
          sx={{ marginTop: "-5px", marginBottom: "-5px" }}
        >
          {votes}
        </Typography>
        <Tooltip title="Downvote" placement="top">
          <IconButton
            onClick={() => handleVote("down")}
            color={voted === "down" ? "primary" : "default"}
            size="small"
          >
            <DownloadRounded />
          </IconButton>
        </Tooltip>
      </div>
      <Tooltip
        title={
          flagged
            ? "This post/comment has been flagged for a review"
            : "Flag this post/comment"
        }
        placement="top"
      >
        <IconButton size="small" onClick={handleFlag}>
          <FlagRounded color={flagged ? "primary" : "default"} />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default UpvoteDownvote;
