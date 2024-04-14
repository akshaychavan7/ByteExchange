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
const UpvoteDownvote = ({ voteCount, isUpvoted, isDownvoted }) => {
  const alert = useAlert();
  const [votes, setVotes] = useState(voteCount || 0);
  const [voted, setVoted] = useState(null);

  useEffect(() => {
    setVoted(isUpvoted ? "up" : isDownvoted ? "down" : null);
  }, [isUpvoted, isDownvoted]);

  useEffect(() => {
    setVotes(voteCount);
  }, [voteCount]);

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
      <Tooltip title="Flag" placement="top">
        <IconButton size="small">
          <FlagRounded />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default UpvoteDownvote;
