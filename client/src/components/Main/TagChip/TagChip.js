import "./TagChip.css";

export default function TagChip({ tag, clickTag }) {
  return (
    <button
      className="question_tag_button"
      onClick={(e) => {
        e.stopPropagation();
        clickTag(tag.name);
      }}
    >
      {tag.name}
    </button>
  );
}
