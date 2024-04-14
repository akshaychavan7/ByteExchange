import { Tooltip } from "@mui/material";
import "./TagChip.css";

export default function TagChip({ tag, clickTag }) {
  return (
    <Tooltip title={`View ${tag.name} tagged questions`} placement="top">
      <button
        className="question_tag_button"
        onClick={(e) => {
          e.stopPropagation();
          clickTag(tag.name);
        }}
      >
        {tag.name}
      </button>
    </Tooltip>
  );
}
